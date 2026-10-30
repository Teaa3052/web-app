import { findHabitsByUser, findLogsByUser } from "../models/habitModel.js"
import { habitStats, statsFrom, summarize } from "../utils/stats.js"

// statistika svih aktivnih navika korisnika za zadnjih 30 dana + sažetak za vrh stranice
export const getStats = async (req, res) => {
    const { today } = req.query // već provjereno u validate: 'YYYY-MM-DD', današnji datum s frontenda
    const from = statsFrom(today) // prvi od 30 dana, npr. today '2026-10-30' -> '2026-10-01'

    // ista dva upita kao za Dashboard: navike i svi njihovi zapisi
    const habits = await findHabitsByUser(req.user.id)
    const logs = await findLogsByUser(req.user.id)

    const habitsWithStats = habits.map((habit) => {
        // datumi samo ove navike
        const dates = logs
            .filter((log) => log.habitId === habit.id)
            .map((log) => log.logDate)

        // createdAt je Date objekt (timestamptz iz baze) -> samo datum 'YYYY-MM-DD' (u UTC-u)
        const createdDate = habit.createdAt.toISOString().slice(0, 10)

        return {
            id: habit.id,
            name: habit.name,
            frequency: habit.frequency,
            ...habitStats(dates, habit.frequency, createdDate, today), // done, total, percent, streak, doneInPeriod
            dates: dates.filter((date) => date >= from), // samo zadnjih 30 dana, za mrežu dana na stranici
        }
    })

    res.status(200).json({
        from, // prvi dan prozora
        to: today, // zadnji dan prozora
        summary: summarize(habitsWithStats),
        habits: habitsWithStats,
    })
}
