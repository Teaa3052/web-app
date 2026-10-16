import { useState } from "react"
import HabitCard from "@/components/HabitCard"
import AddHabitDialog from "@/components/AddHabitDialog"

function Dashboard() {
    const [habits, setHabits] = useState([
        { id: 1, name: "Trčanje", streak: 5, doneToday: false },
        { id: 2, name: "Čitanje", streak: 12, doneToday: true },
    ])

    const onToggleToday = (id) => {
        setHabits(prev =>
            prev.map(h => h.id === id ? { ...h, doneToday: !h.doneToday } : h)
        )
    }

    // sidebar i gornju traku sada daje AppLayout, pa ovdje ostaje samo sadržaj stranice
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <AddHabitDialog onAddHabit={(newHabit) => {
                    setHabits(prev => [...prev, { ...newHabit, id: Date.now(), streak: 0, doneToday: false }])
                }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {habits.map(habit => (
                    <HabitCard key={habit.id} habit={habit} onToggleToday={onToggleToday} />
                ))}
            </div>
        </>
    )
}
export default Dashboard
