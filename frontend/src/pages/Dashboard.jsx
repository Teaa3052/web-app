import { useState, useEffect } from "react"
import HabitCard from "@/components/HabitCard"
import AddHabitDialog from "@/components/AddHabitDialog"
import HabitCalendar from "@/components/HabitCalendar"
import { api } from "@/api/client"
import { todayString } from "@/utils/dates"
import { monthGrid, monthName } from "@/utils/calendar"

async function fetchHabits() {
    const response = await api.get('/habits', { params: { today: todayString() }})
    return response.data.habits
}

function Dashboard() {
    const [habits, setHabits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    async function toggleLog(habitId, date, isDone) {
        if(isDone) {
            await api.delete(`/habits/${habitId}/logs/${date}`)
        } else {
            await api.put(`/habits/${habitId}/logs/${date}`)
        }
        setHabits(await fetchHabits())
    }

    async function addHabit(newHabit) {
        const response = await api.post('/habits', newHabit) // newHabit = { name, frequency } iz dijaloga
        const habit = response.data.habit // backend vrati { habit: {id,name,frequency,createdAt}}
        setHabits(prev => [...prev, { ...habit, doneInPeriod: false, streak: 0, dates: []}]) // nova navika još nema zapisa
    }


    useEffect(() => {
        async function loadHabits() {
            try {
                setHabits(await fetchHabits())
                 // navike s backenda, svaka s doneInPeriod, streak i dates
            } catch {
                setError('Could not load habits') // backend ne radi ili je vratio grešku
            } finally {
                setLoading(false) // gotovo učitavanje, uspjelo ili ne
            }
        }
        loadHabits()
    }, []) // [] = samo jednom, pri prvom prikazu

    const today = todayString()
    const weeks = monthGrid(today)
    const daily = habits.filter(habit => habit.frequency === 'daily')
    const other = habits.filter(habit => habit.frequency !== 'daily')
    
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
                // jedan veliki okvir: gore dnevne navike (kalendari), dolje tjedne i mjesečne
                <div className="rounded-2xl border">
                    <section className="space-y-5 p-6">
                        <div className="flex items-baseline justify-between">
                            <h2 className="text-lg font-bold">Daily</h2>
                            <span className="font-semibold">{monthName(today)}</span>
                        </div>
                        {daily.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No daily habits yet.</p>
                        ) : (
                            // svaka dnevna navika ima svoj kalendar; u red stane onoliko koliko ima mjesta (min. 266px)
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(266px,1fr))] gap-8">
                                {daily.map(habit => (
                                    <HabitCalendar
                                        key={habit.id}
                                        habit={habit}
                                        weeks={weeks}
                                        onToggle={(date, isDone) => toggleLog(habit.id, date, isDone)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* weekly i monthly: zasad stare kartice (klik još ne radi), mijenjamo u sljedećem koraku */}
                    {other.length > 0 && (
                        <section className="grid grid-cols-1 gap-4 border-t p-6 sm:grid-cols-2 lg:grid-cols-3">
                            {other.map(habit => (
                                <HabitCard key={habit.id} habit={habit} onToggleToday={() => {}} />
                            ))}
                        </section>
                    )}
                </div>
            )}
        </>
    )
}
export default Dashboard
