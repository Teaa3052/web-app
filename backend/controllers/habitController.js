import { findHabitsByUser, createHabit, findHabitById, addLog, removeLog, findLogsByUser } from "../models/habitModel.js";
import { AppError } from "../utils/AppError.js"
import { periodStart } from "../utils/dates.js"
import { calculateStreak  } from "../utils/streak.js";

// sve aktivne navike korisnika, svaka s informacijom je li odrađena u ovom periodu
export const getHabits = async (req, res) => {
    const { today } = req.query // već provjereno u validate: 'YYYY-MM-DD', današnji datum s frontenda

    // 1. dva upita: navike i svi zapisi (logovi) tih navika
    const habits = await findHabitsByUser(req.user.id)
    const logs = await findLogsByUser(req.user.id)

    // 2. svaku naviku pretvori u novu: ista polja + doneInPeriod i streak
    const habitsWithStatus = habits.map((habit) => {
        // datumi samo ove navike, npr. ['2026-10-21', '2026-10-22']
        const dates = logs
            .filter((log) => log.habitId === habit.id)
            .map((log) => log.logDate)

        // početak perioda u kojem je danas (taj dan, ponedjeljak tog tjedna ili 1. u mjesecu)
        const currentPeriod = periodStart(today, habit.frequency)

        // odrađeno ako barem jedan datum pada u taj isti period
        const doneInPeriod = dates.some((date) => periodStart(date, habit.frequency) === currentPeriod)

        return { ...habit, doneInPeriod, streak: calculateStreak(dates, habit.frequency, today) } 
    })

    // 3. pošalji nove navike (s dodanim poljima)
    res.status(200).json({ habits: habitsWithStatus })
}

export const addHabit = async (req, res) => {
    const { name, frequency } = req.body
    const habit = await createHabit(req.user.id, name, frequency) // vlasnik uvijek iz tokena, nikad iz bodya
    res.status(201).json({ habit }) 
}

// označi naviku odrađenom za taj dan
export const markDone = async (req, res) => {
    const { id, date } = req.params // već provjereno: id je broj, date je yyyy-mm-dd
    
    // 1. smije li ovaj korisnik dirati ovu naviku? (Postoji, njegova je, nije arhivirana)
    const habit = await findHabitById(id, req.user.id)
    if (!habit) {
        throw new AppError(404, 'Habit not found')
    }

    // 2. Zapiši oznaku (ako postoji, ne radi ništa)
    await addLog(id, date)

    // 3. Uspjelo je, nema ništa za vratiti
    res.status(204).end()

}

export const unmarkDone = async (req, res) => {
    const { id, date } = req.params
    
    const habit = await findHabitById(id, req.user.id)
    if (!habit) {
        throw new AppError(404, 'Habit not found')
    }

    await removeLog(id, date)
    res.status(204).end()
}


