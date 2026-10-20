import { z } from 'zod'

export const createHabitSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
    frequency: z.enum(['daily', 'weekly', 'monthly'], 'Invalid frequency'),
})
