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

export {findHabitsByUser, createHabit }
