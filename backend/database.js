import pg from 'pg' // uvoz PostgreSQL modula 
const { Pool } = pg // destrukturiranje da dohvatimo klasu Pool 

import dotenv from 'dotenv' //uvoz .env varijabli iz datoteke
dotenv.config() // učita .env podatke 

//kreiranje bazena konekcija pomoću .env postavki 
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})


// funkcija koja testira vezu s bazom 
async function testConnection() {
    const res = await pool.query('SELECT NOW()') // upit za trenutno vrijeme 
    console.log(res.rows) // ispis rezultata
}

testConnection()

export default pool // izvoz poola da ga druge datoteke mogu koristit 