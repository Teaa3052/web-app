import { AppError } from '../utils/AppError.js'

// Generički middleware za validaciju: provjeri dio zahtjeva prema zod shemi.
// source = koji dio zahtjeva provjeravamo: 'body' (tijelo, zadano) ili 'params' (dijelovi URL-a, npr. :id)
// Korištenje u ruti:
//   router.post('/register', validate(registerSchema), register)
//   router.put('/:id/logs/:date', validate(logParamsSchema, 'params'), markDone)
export const validate = (schema, source = 'body') => (req, res, next) => {
    const result = schema.safeParse(req[source])

    // podaci ne odgovaraju shemi -> 400, s popisom grešaka po poljima
    if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
            field: issue.path.join('.') || source, // npr. "email"; "body" ako tijela uopće nema
            message: issue.message,
        }))
        throw new AppError(400, errors[0].message, errors) // prva greška je glavna poruka
    }

    // podaci su ispravni -> zamijeni ih očišćenim podacima (npr. email malim slovima, id kao broj)
    // i bez polja koja shema ne poznaje
    req[source] = result.data
    next()
}
