import { z } from 'zod'

export const createHabitSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
    frequency: z.enum(['daily', 'weekly', 'monthly'], 'Invalid frequency'),
})

export const logParamsSchema = z.object ({
    id: z.coerce.number('Invalid habit id').int('Invalid habit id').positive('Invalid habit id'),
    date: z.iso.date('Invalid date')
})