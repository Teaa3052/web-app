import { periodStart, previousPeriod } from './dates.js'

// Koliko perioda zaredom je navika odrađena (dana, tjedana ili mjeseci).
// dates     = datumi kad je navika označena, npr. ['2026-10-21', '2026-10-22']
// frequency = 'daily', 'weekly' ili 'monthly'
// today     = današnji datum s frontenda, npr. '2026-10-22'
export function calculateStreak(dates, frequency, today) {
    // 1. svaki datum pretvori u početak njegovog perioda i spremi u Set (bez duplikata)
    //    weekly: ['2026-10-20', '2026-10-21'] -> {'2026-10-19'} (isti tjedan se broji jednom)
    const donePeriods = new Set(dates.map((date) => periodStart(date, frequency)))

    // 2. početak perioda u kojem je danas
    const current = periodStart(today, frequency)

    // 3. odakle krećemo brojati:
    //    tekući period odrađen -> od njega
    //    nije odrađen -> od prethodnog (period još traje, pa streak nije prekinut)
    let period = current
    if (!donePeriods.has(current)) {
        period = previousPeriod(current, frequency)
    }

    // 4. idi unatrag period po period dok su odrađeni; prvi neodrađeni prekida niz
    let streak = 0
    while (donePeriods.has(period)) {
        streak++
        period = previousPeriod(period, frequency)
    }

    return streak
}
