import express from 'express'
import { getStats } from '../controllers/statsController.js'
import { habitsQuerySchema } from '../schemas/habitSchemas.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(requireAuth) // statistika je samo za prijavljenog korisnika

// GET /api/stats?today=2026-10-30 (isti ?today kao kod navika, pa i ista shema)
router.get('/', validate(habitsQuerySchema, 'query'), getStats)

export default router
