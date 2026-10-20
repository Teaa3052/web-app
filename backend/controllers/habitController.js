import { findHabitsByUser, createHabit } from "../models/habitModel.js";


export const getHabits = async (req, res) => {
    const habits = await findHabitsByUser(req.user.id)
    res.status(200).json({ habits })
}

export const addHabit = async (req, res) => {
    const { name, frequency } = req.body
    const habit = await createHabit(req.user.id, name, frequency) // vlasnik uvijek iz tokena, nikad iz bodya
    res.status(201).json({ habit }) 
}



