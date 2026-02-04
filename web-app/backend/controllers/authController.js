// register logika - prima podatke, hashira password, poziva userModel za INSERT u bazu, vraća response
import bycrypt from "bcrypt"
import { findByEmail, createUser } from "../models/userModel.js" 
import { buildCheckFunction } from "express-validator"
import jwt from 'jsonwebtoken'

const secretKey = process.env.JWT_SECRET

export const register = async (req, res) => {
    console.log("Register called, body:", req.body)
    try {
        const {email, password, nickname, dateOfBirth, profilePicture} = req.body

        const existing = await findByEmail(email)
        if (existing) {
            return res.status(400).json({ message: "User already exists" })
        }

        const hashedPassword = await bycrypt.hash(password, 10)  // šta je ovo 10 ?? 

        const newUser = await createUser(email, hashedPassword, nickname, dateOfBirth, profilePicture)

        res.status(201).json({
            message: "User created",
            user: newUser
        })
    } catch (err) {
        console.error("Error:", err.message)
        res.status(500).json({ message: "Server error" })
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await findByEmail(email)
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const match = await bycrypt.compare(password, user.password)
        if (!match) {
            return res.status(400).json({ message: "Invalid password" })
        }
        res.status(200).json({
            message: "Login succesful",
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname
            }
        })

        const token = jwt.sign(  // stvara token -> jwt.sign(payload, secretKey, options) payload su podaci o korisniku
            { 
                id: user.id,
                email: user.email,
                nickname: user.nickname, 
                role: user.role
             }, 
             secretKey,
            {expiresIn: '1h'}) 

        res.json({ token }) // vraća odg FRONTu 

    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}