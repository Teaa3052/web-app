// Današnji datum kao 'YYYY-MM-DD' po LOKALNOM vremenu korisnika.
// Šalje se backendu u ?today=..., jer server ne zna u kojoj je vremenskoj zoni korisnik.
// Ne koristimo toISOString(): on daje UTC, pa bi u Hrvatskoj između ponoći i 1-2 h ujutro vratio jučerašnji datum.
// Primjer: todayString() -> '2026-10-23'
export function todayString() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0') // getMonth: siječanj = 0; padStart: 9 -> '09'
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}
