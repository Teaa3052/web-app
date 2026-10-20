// SQL upiti za navike - svaki upit radi samo s navikama jednog korisnika (user_id)
import pool from '../database.js'


// sve aktivne navike korisnika 
async function findHabitsByUser(userId) {
    const query = `
    SELECT id, name, frequency, created_at AS "createdAt"
    FROM habits 
    WHERE user_id = $1 AND archived_at IS NULL
    ORDER BY created_at
    `
    const values = [userId]

    const result = await pool.query(query, values)
    return result.rows
}

// kreiranje nove navike 
async function createHabit(userId, name, frequency) {
    const query = `
    INSERT INTO habits ( user_id, name, frequency)
    VALUES ($1, $2, $3)
    RETURNING id, name, frequency, created_at AS "createdAt"
    `
    const values = [ userId, name, frequency]

    const result = await pool.query(query, values)
    return result.rows[0]
}

// navika s tim id-om samo ako je moja i aktivna
async function findHabitById (habitId, userId) {
    const query = `
    SELECT id 
    FROM habits 
    WHERE id = $1 AND user_id = $2 AND archived_at IS NULL
    `
    const values = [ habitId, userId ]
    const result = await pool.query(query, values)
    return result.rows[0]

}

// Označi naviku odrađenom za taj dan (ponovni poziv ne radi ništa)
async function addLog (habitId, date) {
    const query = `
    INSERT INTO habit_logs(habit_id, log_date)
    VALUES ($1, $2)
    ON CONFLICT (habit_id, log_date) DO NOTHING
    `
    const values = [habitId, date]
    await pool.query(query, values) // samo zapiši ništa ne vraćamo 
}

// Obriši oznaku za naviku s tim id-om za određeni dan 
async function removeLog (habitId, date) {
    const query = `
    DELETE FROM habit_logs 
    WHERE habit_id = $1 AND log_date = $2
    `
    const values = [habitId, date]
    await pool.query(query, values)

}

export {findHabitsByUser, createHabit, findHabitById, addLog, removeLog }
