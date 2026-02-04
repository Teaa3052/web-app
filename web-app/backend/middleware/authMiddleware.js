// authMiddleware.js sadrži middleware funkcije za autentifikaciju i autorizaciju (provjera tokena, uloga korisnika, pristupnih prava)

export const authenticateToken = ( req, res, next) => {

    // Dohvati token iz autorizacijskoj hedera???? 
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    // ako je token false, vrati error 
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized. No token provided."
        })
    }
    try {
        // verificiraj token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded // spremi korisnikove podatke u zahtjev

        next() // nastavi do sljedećeg middlewarea ili rute
    } catch (err) {
        return res.status(403).json({
            message: "Forbidden - Invalid or expired token",
        })
    }
}


