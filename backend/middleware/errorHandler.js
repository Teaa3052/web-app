import { AppError } from '../utils/AppError.js'

// 404 za svaku rutu koja ne postoji - u app.js ide NAKON svih ruta
export const notFound = (req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
}

// Centralno mjesto za sve greške. Express ga prepoznaje po 4 parametra (err, req, res, next).
// Express 5 sam proslijedi ovamo i greške iz async funkcija, pa controlleri ne trebaju try/catch.
export const errorHandler = (err, req, res, next) => {
    // odgovor je već poslan - ne možemo poslati drugi, pa grešku predajemo Expressu
    if (res.headersSent) {
        return next(err)
    }

    // neispravan JSON u tijelu zahtjeva (greška iz express.json())
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Invalid JSON in request body' })
    }

    // naše namjerne greške - poruka je sigurna za prikaz korisniku
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message })
    }

    // sve ostalo je neočekivano: detalje ispisujemo samo na serveru, korisnik dobije općenitu poruku
    console.error(err)
    res.status(500).json({ message: 'Server error' })
}
