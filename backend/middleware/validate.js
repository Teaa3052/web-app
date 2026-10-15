import { AppError } from '../utils/AppError.js'

// Generički middleware za validaciju: provjeri req.body prema zod shemi.
// Korištenje u ruti: router.post('/register', validate(registerSchema), register)
export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)

    // podaci ne odgovaraju shemi -> 400, s popisom grešaka po poljima
    if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
            field: issue.path.join('.') || 'body', // npr. "email"; "body" ako tijela uopće nema
            message: issue.message,
        }))
        throw new AppError(400, errors[0].message, errors) // prva greška je glavna poruka
    }

    // podaci su ispravni -> zamijeni req.body očišćenim podacima (npr. email bez razmaka, malim slovima)
    // i bez polja koja shema ne poznaje
    req.body = result.data
    next()
}
