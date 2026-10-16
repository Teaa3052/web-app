// Crvena poruka ispod polja forme, npr. "Email is required".
// Ne prikazuje ništa ako greške nema. Primjer: <FieldError error={errors.email} />
function FieldError({ error }) {
    if (!error) return null
    return <p className="text-sm text-destructive">{error.message}</p>
}

export default FieldError
