import { useState, useEffect } from "react"
import HabitCard from "@/components/HabitCard"
import AddHabitDialog from "@/components/AddHabitDialog"
import { api } from "@/api/client"
import { todayString } from "@/utils/dates"

function Dashboard() {
    const [habits, setHabits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const onToggleToday = (id) => {
        setHabits(prev =>
            prev.map(h => h.id === id ? { ...h, doneInPeriod: !h.doneInPeriod } : h)
        )
    }

    async function addHabit(newHabit) {
        const response = await api.post('/habits', newHabit) // newHabit = { name, frequency } iz dijaloga
        const habit = response.data.habit // backend vrati { habit: {id,name,frequency,createdAt}}
        setHabits(prev => [...prev, { ...habit, doneInPeriod: false, streak: 0}]) // nova navika još nema zapisa
    }


    useEffect(() => {
        async function loadHabits() {
            try {
                const response = await api.get('/habits', { params: { today: todayString() } })
                setHabits(response.data.habits) // navike s backenda, svaka s doneInPeriod i streak
            } catch {
                setError('Could not load habits') // backend ne radi ili je vratio grešku
            } finally {
                setLoading(false) // gotovo učitavanje, uspjelo ili ne
            }
        }
        loadHabits()
    }, []) // [] = samo jednom, pri prvom prikazu

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p className="text-destructive">{error}</p>
    }

    // sidebar i gornju traku sada daje AppLayout, pa ovdje ostaje samo sadržaj stranice
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <AddHabitDialog onAddHabit={addHabit} />
            </div>
            {habits.length === 0 ? (
                <p className="text-muted-foreground">No habits yet. Add your first one!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {habits.map(habit => (
                        <HabitCard key={habit.id} habit={habit} onToggleToday={onToggleToday} />
                    ))}
                </div>
            )}
        </>
    )
}
export default Dashboard
