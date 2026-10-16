// authMiddleware.js sadrži middleware funkcije za autentifikaciju i autorizaciju (provjera tokena, uloga korisnika, pristupnih prava)
import { AppError } from "../utils/AppError.js"
import jwt from 'jsonwebtoken'
import { config } from "../config.js"

export const requireAuth = ( req, res, next) => {

    // Dohvati token iz cookija 
    const token = req.cookies.token

    // ako je token false, vrati error 
    if (!token) {
        throw new AppError(401, 'Not authorized')
    }
    try {
        const payload = jwt.verify(token, config.jwtSecret) // provjeri potpis i istek; vraća { id, iat, exp }
        req.user = { id: payload.id } // zapamti tko je korisnik, da ga controller zna
        next() // nastavi do sljedećeg middlewarea ili rute
    } catch (err) {
        throw new AppError(401, 'Not authorized')
    }
}


