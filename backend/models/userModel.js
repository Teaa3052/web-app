// SQL upiti vezani za User tablicu (INSERT za kreiranje usera, SELECT za provjeru postoji li email itd.)
import pool from '../database.js' // uvozim vezu s bazom podataka koju sam napravila 


// funkcija 'kreiraj usera' koja prima 5 parametara
async function createUser (email, hashedPassword, nickname, dateOfBirth, profilePicture) {
    const query = `
        INSERT INTO users (email, password, nickname, birthday, profile_picture)
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING users_id, email, nickname
    ` // SQL upit koji kaže bazi 'Stavi nove podatke u tablicu USER', nakon unesenog vrati mi id, email i nickname novog usera
      // ove VALUES $1, $2, ... su ''ruparice'' - sigurnost

    const values = [email, hashedPassword, nickname, dateOfBirth, profilePicture] // niz s pravim vrijednostima koje idu u ''ruparice''

    const result = await pool.query(query, values)
    return result.rows[0]
    // izvršava SQL upit i čeka rezultat (await), 
    // result.rows[0] - prvi red rezultata (novi user koji je upravo kreiran)
}

async function findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1` // daj mi SVE o tom korisniku, ali samo onog čiji email odgovara
    const values = [email]

    const result = await pool.query(query, values)
    return result.rows[0]
    // ako korisik postoji vraća podatke, ako ne vraća Undefined
}

export { createUser, findByEmail }