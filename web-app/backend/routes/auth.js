// definira rute (POST /register, POST /login) i povezuje ih s controller funkcijama + validacijom

import express from 'express'
import { register, login } from '../controllers/authController.js'
import { validateLogin, validateRegister } from '../middleware/validateRequest.js'

const router = express.Router() // instanca Router klase 

// POST /api/auth/register
router.post('/register', validateRegister, register)
     // POST ruta koja sluša na /register endpoint - prima podatke iz req (poslije će pozvati controller funkciju koja će kreirati usera u bazi)

router.post('/login', validateLogin, login)


export default router