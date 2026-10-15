// SQL upiti vezani za User tablicu (INSERT za kreiranje usera, SELECT za provjeru postoji li email itd.)
import pool from '../database.js' // uvozim vezu s bazom podataka koju sam napravila 


// funkcija 'kreiraj usera' koja prima 3 parametra
async function createUser (email, passwordHash, nickname ) {
    const query = `
        INSERT INTO users (email, password_hash, nickname)
        VALUES ($1, $2, $3) 
        RETURNING id, email, nickname, created_at AS "createdAt"
    ` // SQL upit koji kaže bazi 'Stavi nove podatke u tablicu USER', nakon unesenog vrati mi id, email, nickname i createdAt novog usera
      // ove VALUES $1, $2, ... su ''ruparice'' - sigurnost

    const values = [email, passwordHash, nickname ] // niz s pravim vrijednostima koje idu u ''ruparice''

    const result = await pool.query(query, values)
    return result.rows[0]
    // izvršava SQL upit i čeka rezultat (await), 
    // result.rows[0] - prvi red rezultata (novi user koji je upravo kreiran)
}

async function findByEmail(email) {
    const query = `
    SELECT id, email, password_hash AS "passwordHash", nickname, created_at AS "createdAt"
    FROM users WHERE email = $1` // daj mi navedene podatke o korisniku s trazenim emailom 
    const values = [email]

    const result = await pool.query(query, values)
    return result.rows[0]
    // ako korisik postoji vraća podatke, ako ne vraća Undefined
}

export { createUser, findByEmail }