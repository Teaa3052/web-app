// Greška koju bacamo namjerno, kad znamo što je pošlo po zlu (npr. 401 krivi podaci, 404 ne postoji).
// Nosi HTTP status, pa errorHandler zna što poslati frontendu.
// Primjer: throw new AppError(401, "Invalid email or password")
// `details` je neobavezan - koristi ga validate() za popis grešaka po poljima
export class AppError extends Error {
    constructor(statusCode, message, details) {
        super(message)
        this.statusCode = statusCode
        this.details = details
    }
}
