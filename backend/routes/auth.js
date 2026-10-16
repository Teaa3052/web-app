// definira rute (POST /register, POST /login) i povezuje ih s controller funkcijama + validacijom

import express from 'express'
import { register, login, me, logout } from '../controllers/authController.js'
import { loginSchema, registerSchema } from '../schemas/authSchemas.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router() // instanca Router klase 

// POST /api/auth/register
router.post('/register', validate(registerSchema), register)
     // POST ruta koja sluša na /register endpoint - prima podatke iz req (poziva controller funkciju koja će kreirati usera u bazi)

router.post('/login', validate(loginSchema), login)
router.get('/me', requireAuth, me)
router.post('/logout', logout)


export default router