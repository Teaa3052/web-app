// Računanje statistike navika. Čiste funkcije: primaju podatke, vraćaju rezultat, ne diraju bazu.
import { addDays, periodStart } from './dates.js'
import { calculateStreak } from './streak.js'

export const STATS_DAYS = 30 // statistika gleda zadnjih 30 dana, uključujući danas

// Prvi dan prozora od 30 dana: statsFrom('2026-10-30') -> '2026-10-01'
export function statsFrom(today) {
    return addDays(today, -(STATS_DAYS - 1))
}

// Statistika jedne navike za zadnjih 30 dana.
// dates = svi datumi zapisa te navike ('YYYY-MM-DD'), createdDate = dan kad je navika napravljena
// Vraća { done, total, percent, streak, doneInPeriod }:
//   total   = koliko perioda (dana/tjedana/mjeseci) je navika imala u tih 30 dana
//   done    = u koliko od tih perioda je odrađena
//   percent = done / total u postocima, ili null ako još nema nijednog perioda (npr. navika napravljena danas)
export function habitStats(dates, frequency, createdDate, today) {
    // navika "postoji" od dana kad je napravljena, ili od prvog zapisa ako je netko označio i ranije dane
    // (datumi kao tekst 'YYYY-MM-DD' se sortiraju ispravno, pa je [0] najraniji)
    const firstDay = [createdDate, ...dates].sort()[0]
    const windowStart = statsFrom(today)
    const from = firstDay > windowStart ? firstDay : windowStart // kasniji od ta dva

    // svi periodi od from do danas, bez ponavljanja (Set): za tjedne npr. {'2026-09-28', '2026-10-05', ...}
    const periods = new Set()
    for (let date = from; date <= today; date = addDays(date, 1)) {
        periods.add(periodStart(date, frequency))
    }

    // periodi u kojima postoji barem jedan zapis
    const donePeriods = new Set(dates.map((date) => periodStart(date, frequency)))
    const current = periodStart(today, frequency)
    const doneInPeriod = donePeriods.has(current)

    // tekući period se broji samo ako je već odrađen (isto pravilo kao kod streaka):
    // jutro bez oznake još nije propušten dan
    if (!doneInPeriod) {
        periods.delete(current)
    }

    let done = 0
    for (const period of periods) {
        if (donePeriods.has(period)) {
            done++
        }
    }
    const total = periods.size

    return {
        done,
        total,
        percent: total === 0 ? null : Math.round((done / total) * 100),
        streak: calculateStreak(dates, frequency, today),
        doneInPeriod,
    }
}

// Sažetak za vrh stranice, iz navika koje već imaju izračunatu statistiku (rezultat habitStats).
export function summarize(habits) {
    // prosjek postotaka: svaka navika vrijedi jednako; navike bez podataka (percent = null) preskačemo
    let sum = 0
    let count = 0
    for (const habit of habits) {
        if (habit.percent !== null) {
            sum += habit.percent
            count++
        }
    }

    // najduži trenutni niz među dnevnim navikama
    let best = null
    for (const habit of habits) {
        if (habit.frequency === 'daily' && habit.streak > 0 && (!best || habit.streak > best.streak)) {
            best = habit
        }
    }

    return {
        averagePercent: count === 0 ? null : Math.round(sum / count),
        bestStreak: best ? { name: best.name, days: best.streak } : null,
        doneThisPeriod: habits.filter((habit) => habit.doneInPeriod).length, // koliko ih je odrađeno u svom tekućem periodu
        habitCount: habits.length,
    }
}
