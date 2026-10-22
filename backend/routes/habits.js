import express from 'express'
import { getHabits, addHabit, markDone, unmarkDone } from '../controllers/habitController.js'
import { createHabitSchema, logParamsSchema, habitsQuerySchema } from '../schemas/habitSchemas.js'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(requireAuth) // svaka ruta traži prijavu 

// prvo middleware pa controller
router.get('/', validate(habitsQuerySchema, 'query'), getHabits)
router.post('/', validate(createHabitSchema), addHabit )
router.put('/:id/logs/:date', validate(logParamsSchema, 'params'), markDone)
router.delete('/:id/logs/:date', validate(logParamsSchema, 'params'), unmarkDone)


export default router
