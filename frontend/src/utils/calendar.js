// Pomoćne funkcije za kalendar na Dashboardu. Datumi su uvijek tekst 'YYYY-MM-DD', kao na backendu.
// Računamo u UTC-u, da vremenska zona preglednika ne pomakne datum za jedan dan.

// 'YYYY-MM-DD' -> Date objekt (ponoć u UTC-u)
function toDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day))
}

// Date objekt -> 'YYYY-MM-DD'
function toDateStr(date) {
    return date.toISOString().slice(0, 10)
}

// Datum pomaknut za n dana: addDays('2026-10-31', 1) -> '2026-11-01', addDays('2026-10-01', -1) -> '2026-09-30'
export function addDays(dateStr, n) {
    const date = toDate(dateStr)
    date.setUTCDate(date.getUTCDate() + n)
    return toDateStr(date)
}

// Početak perioda kojem datum pripada (ista pravila kao periodStart na backendu):
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

// Mreža kalendara za mjesec u kojem je today: tjedni od ponedjeljka do nedjelje.
// Vraća niz tjedana, a svaki tjedan je niz od 7 dana:
//   { date: '2026-09-28', day: 28, inMonth: false, isToday: false, isFuture: false }
// inMonth = false za dane susjednih mjeseci (prikazuju se sivo), isFuture = dan još nije došao.
// Primjer: monthGrid('2026-10-27') -> 5 tjedana, od pon 28. 9. do ned 1. 11.
export function monthGrid(today) {
    const month = today.slice(0, 7) // '2026-10'
    let date = periodStart(periodStart(today, 'monthly'), 'weekly') // ponedjeljak tjedna u kojem je 1. u mjesecu
    const weeks = []

    // dodajemo tjedne dok ponedjeljak sljedećeg tjedna još pripada ovom mjesecu
    do {
        const week = []
        for (let i = 0; i < 7; i++) {
            week.push({
                date,
                day: Number(date.slice(8)),
                inMonth: date.slice(0, 7) === month,
                isToday: date === today,
                isFuture: date > today, // datumi kao tekst se mogu uspoređivati
            })
            date = addDays(date, 1)
        }
        weeks.push(week)
    } while (date.slice(0, 7) === month)

    return weeks
}

// Periodi za red tjedne ili mjesečne navike. Svaki period je jedan kvadratić:
//   { start: početak perioda, label: tekst u kvadratiću, isCurrent: period u kojem je danas, isFuture: još nije došao }

// Tjedni mjeseca u kojem je today, numerirani od 1 (isti tjedni kao u monthGrid).
// Vraća: [{ start: '2026-09-28', label: '1', isCurrent: false, isFuture: false }, ...]
export function monthWeeks(today) {
    const currentWeek = periodStart(today, 'weekly')
    return monthGrid(today).map((week, i) => ({
        start: week[0].date, // ponedjeljak tog tjedna
        label: String(i + 1),
        isCurrent: week[0].date === currentWeek,
        isFuture: week[0].date > currentWeek,
    }))
}

// Samo tekući mjesec, kao niz s jednim periodom (isti oblik kao monthWeeks).
// Vraća: [{ start: '2026-10-01', label: 'Oct', isCurrent: true, isFuture: false }]
export function thisMonth(today) {
    return [{
        start: periodStart(today, 'monthly'),
        label: monthName(today, 'short'),
        isCurrent: true,
        isFuture: false,
    }]
}

// Ime mjeseca na engleskom: monthName('2026-10-27') -> 'October 2026', monthName('2026-10-27', 'short') -> 'Oct'
export function monthName(today, format = 'long') {
    const options = format === 'short'
        ? { month: 'short', timeZone: 'UTC' }
        : { month: 'long', year: 'numeric', timeZone: 'UTC' }
    return toDate(today).toLocaleDateString('en-GB', options)
}
