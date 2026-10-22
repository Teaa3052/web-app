// Pomoćne funkcije za periode navika. Datumi su uvijek tekst 'YYYY-MM-DD' (kao log_date u bazi).
// Računamo u UTC-u, da vremenska zona servera ne pomakne datum za jedan dan.

// 'YYYY-MM-DD' -> Date objekt (ponoć u UTC-u)
function toDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day))
}

// Date objekt -> 'YYYY-MM-DD'
function toDateStr(date) {
    return date.toISOString().slice(0, 10)
}

// Početak perioda kojem datum pripada:
//   daily   -> taj isti dan             ('2026-10-22' -> '2026-10-22')
//   weekly  -> ponedjeljak tog tjedna   ('2026-10-22' -> '2026-10-19')
//   monthly -> prvi dan u mjesecu       ('2026-10-22' -> '2026-10-01')
export function periodStart(dateStr, frequency) {
    const date = toDate(dateStr)

    if (frequency === 'weekly') {
        const daysSinceMonday = (date.getUTCDay() + 6) % 7 // getUTCDay: nedjelja = 0, ponedjeljak = 1...
        date.setUTCDate(date.getUTCDate() - daysSinceMonday)
    } else if (frequency === 'monthly') {
        date.setUTCDate(1)
    }

    return toDateStr(date)
}

// Početak PRETHODNOG perioda (prima početak perioda, vraća početak onog prije):
//   daily   -> dan prije          ('2026-10-22' -> '2026-10-21')
//   weekly  -> tjedan prije       ('2026-10-19' -> '2026-10-12')
//   monthly -> mjesec prije       ('2026-10-01' -> '2026-09-01')
export function previousPeriod(periodStartStr, frequency) {
    const date = toDate(periodStartStr)

    if (frequency === 'daily') {
        date.setUTCDate(date.getUTCDate() - 1)
    } else if (frequency === 'weekly') {
        date.setUTCDate(date.getUTCDate() - 7)
    } else if (frequency === 'monthly') {
        date.setUTCMonth(date.getUTCMonth() - 1)
    }

    return toDateStr(date)
}
