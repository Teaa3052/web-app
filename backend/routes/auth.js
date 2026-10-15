// definira rute (POST /register, POST /login) i povezuje ih s controller funkcijama + validacijom

import express from 'express'
import { register, login } from '../controllers/authController.js'
import { loginSchema, registerSchema } from '../schemas/authSchemas.js'
import { validate } from '../middleware/validate.js'

const router = express.Router() // instanca Router klase 

// POST /api/auth/register
router.post('/register', validate(registerSchema), register)
     // POST ruta koja sluša na /register endpoint - prima podatke iz req (poziva controller funkciju koja će kreirati usera u bazi)

router.post('/login', validate(loginSchema), login)


export default router