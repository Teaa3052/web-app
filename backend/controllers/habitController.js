import { findHabitsByUser, createHabit, findHabitById, addLog, removeLog } from "../models/habitModel.js";
import { AppError } from "../utils/AppError.js"

export const getHabits = async (req, res) => {
    const habits = await findHabitsByUser(req.user.id)
    res.status(200).json({ habits })
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


