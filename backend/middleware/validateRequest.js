// provjerava jesu li poslani podaci ispravni (je li email validan, je li password dovoljno dug itd. prije nego dođe do CONTROLLERA)

export const validateRegister = (req, res, next) => {
    const { email, password, nickname } = req.body

    if (!email || !password || !nickname) { 
        return res.status(400).json({ message: "All fields required" })
    }

    if (!email.includes("@")) {
        return res.status(400).json({ message: "Invalid email format"})
    }

    if (password.length < 8 ) {
        return res.status(400).json({ message: "Password too short"})
    }

    next()
}

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body
    
    if(!email || !password) {
        return res.status(400).json({ message: "Email and password required" })
    }

    next()
}

// tu ću svakako još dodat validacija 