// register logika - prima podatke, hashira password, poziva userModel za INSERT u bazu, vraća response
import bycrypt from "bcrypt"
import { findByEmail, createUser, findById } from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import { config } from "../config.js"
import { AppError } from "../utils/AppError.js"

const secretKey = config.jwtSecret

export const register = async (req, res) => {
    const {email, password, nickname} = req.body

    const existing = await findByEmail(email)
    if (existing) {
        throw new AppError(409, 'User already exists')
    }

    const hashedPassword = await bycrypt.hash(password, 10)

    const newUser = await createUser(email, hashedPassword, nickname)

    res.status(201).json({
        message: "User created",
        user: newUser
    })
}

export const login = async (req, res) => {
    const {email, password} = req.body

    const user = await findByEmail(email)
    if (!user) {
        throw new AppError(401, 'Invalid email or password')
    }

    const match = await bycrypt.compare(password, user.passwordHash)
    if (!match) {
        throw new AppError(401, 'Invalid email or password')
    }

    const token = jwt.sign(  // stvara token -> jwt.sign(payload, secretKey, options) payload su podaci o korisniku
        {
            id: user.id,
        },
        secretKey,
        {expiresIn: '1h'})

    // token ide u httpOnly cookie: preglednik ga sprema i sam šalje uz svaki zahtjev, a JS ga ne može pročitati
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: config.isProduction,
        maxAge: 60 * 60 * 1000, // 1 sat u milisekundama, isto kao expiresIn tokena
    })

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user.id,
            email: user.email,
            nickname: user.nickname
        }
    })
}


// vraća podatke prijavljenog korisnika (requireAuth je prije ovog zapisao req.user)
export const me = async (req, res) => {
    const user = await findById(req.user.id) // dohvati svježe podatke iz baze

    // token je ispravan, ali korisnik više ne postoji (npr. obrisan račun)
    if (!user) {
        throw new AppError(401, 'Not authorized')
    }

    res.status(200).json({ user })
}

export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax', 
        secure: config.isProduction
    })

    res.status(200).json({ message: 'Logged out' })
}
