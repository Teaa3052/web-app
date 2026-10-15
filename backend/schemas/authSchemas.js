import { z } from 'zod'

const emailField = z.string().trim().toLowerCase().max(254, 'Email is too long!').pipe(z.email('Invalid email address'))

export const registerSchema = z.object({
    email: emailField,
    password: z.string().min(8, 'Password is too short!').max(72, 'Password is too long!'),
    nickname: z.string().trim().min(1, 'Nickname is required!').max(50, 'Nickname is too long!')
})

export const loginSchema = z.object({
    email: emailField,
    password: z.string().min(1, 'Password is required!')
})