// Jedino mjesto koje čita .env i process.env - ostatak aplikacije uvozi gotov `config` objekt
import dotenv from 'dotenv'
dotenv.config({ quiet: true }) // učita .env, bez reklamnih poruka u konzoli

// vraća vrijednost obavezne varijable ili odmah ruši server s jasnom porukom (fail fast)
function required(name) {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Missing required env variable: ${name}`)
    }
    return value
}

export const config = {
    port: Number(process.env.PORT) || 3000,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    databaseUrl: required('DATABASE_URL'),
    jwtSecret: required('JWT_SECRET'),
    isProduction: process.env.NODE_ENV === 'production', // trebat će za cookie (secure) u 0.3.4
}
