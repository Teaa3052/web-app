import express from 'express'
import { getHabits, addHabit } from '../controllers/habitController.js'
import { createHabitSchema } from '../schemas/habitSchemas.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(requireAuth) // svaka ruta traži prijavu 

router.get('/', getHabits)
router.post('/', validate(createHabitSchema), addHabit )


export default router
