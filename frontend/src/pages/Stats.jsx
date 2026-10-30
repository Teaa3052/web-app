import { useState, useEffect } from "react"
import { api } from "@/api/client"
import { todayString } from "@/utils/dates"
import { dateRange, dayLabel } from "@/utils/calendar"
import { cn } from "@/lib/utils"

// jedinica perioda po frekvenciji: [jednina, množina]
const UNITS = {
    daily: ["day", "days"],
    weekly: ["week", "weeks"],
    monthly: ["month", "months"],
}

// unit('weekly', 1) -> 'week', unit('weekly', 5) -> 'weeks'
function unit(frequency, count) {
    return UNITS[frequency][count === 1 ? 0 : 1]
}

// jedan broj na vrhu stranice, s opisom ispod
function SummaryTile({ value, label }) {
    return (
        <div className="bg-background p-5">
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    )
}

// red u "By habit": ime, traka koliko je posto odrađeno, postotak i "12 of 20 days"
function HabitBar({ habit }) {
    const hasData = habit.percent !== null // null = jedini period je tekući i još nije gotov

    return (
        <div className="grid grid-cols-[7rem_1fr_6.5rem] items-center gap-4 sm:grid-cols-[10rem_1fr_7rem]">
            <span className="truncate font-semibold">{habit.name}</span>
            <div className="h-2 rounded-full bg-habit/15">
                {/* širina ovisi o podacima, pa ide kroz style: Tailwind poznaje samo klase napisane unaprijed u kodu */}
                <div className="h-full rounded-full bg-habit" style={{ width: `${habit.percent ?? 0}%` }} />
            </div>
            <div className="text-right">
                <p className="font-semibold">{hasData ? `${habit.percent}%` : "–"}</p>
                <p className="text-xs text-muted-foreground">
                    {hasData
                        ? `${habit.done} of ${habit.total} ${unit(habit.frequency, habit.total)}`
                        : `this ${unit(habit.frequency, 1)} isn't over yet`}
                </p>
            </div>
        </div>
    )
}

// 30 kvadratića za jednu dnevnu naviku, jedan za svaki dan: zelen = odrađeno
function DayStrip({ habit, days }) {
    return (
        <div className="space-y-1.5">
            <p className="font-semibold">{habit.name}</p>
            <div
                role="img"
                aria-label={`${habit.name}: done on ${habit.dates.length} of the last ${days.length} days`}
                className="grid grid-cols-[repeat(30,minmax(0,1fr))] gap-0.5 sm:gap-1"
            >
                {days.map(day => (
                    <div
                        key={day}
                        title={dayLabel(day)}
                        className={cn("aspect-square rounded-sm", habit.dates.includes(day) ? "bg-habit" : "bg-habit/15")}
                    />
                ))}
            </div>
        </div>
    )
}

// Statistika navika za zadnjih 30 dana: sažetak, postotak po navici i dani za dnevne navike
function Stats() {
    const [stats, setStats] = useState(null) // cijeli odgovor backenda: { from, to, summary, habits }
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // isti obrazac kao na Dashboardu: dohvati jednom, pri prvom prikazu
    useEffect(() => {
        async function loadStats() {
            try {
                const response = await api.get('/stats', { params: { today: todayString() } })
                setStats(response.data)
            } catch {
                setError('Could not load stats') // backend ne radi ili je vratio grešku
            } finally {
                setLoading(false) // gotovo učitavanje, uspjelo ili ne
            }
        }
        loadStats()
    }, []) // [] = samo jednom, pri prvom prikazu

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p className="text-destructive">{error}</p>
    }

    const { from, to, summary, habits } = stats
    const days = dateRange(from, to) // 30 datuma, za kvadratiće dnevnih navika
    const daily = habits.filter(habit => habit.frequency === 'daily')
    const best = summary.bestStreak // { name, days } ili null

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <p className="text-sm text-muted-foreground">Last 30 days</p>
                <h1 className="text-2xl font-bold">Stats</h1>
            </div>

            {habits.length === 0 ? (
                <p className="text-muted-foreground">No habits yet. Add one on the dashboard.</p>
            ) : (
                <>
                    {/* sažetak: tri broja jedan do drugog (crte između njih su pozadina koja proviruje kroz gap-px) */}
                    <section aria-label="Overview" className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3">
                        <SummaryTile
                            value={summary.averagePercent === null ? "–" : `${summary.averagePercent}%`}
                            label="average completion"
                        />
                        <SummaryTile
                            value={best ? `${best.days} ${unit('daily', best.days)}` : "–"}
                            label={best ? `best daily streak, ${best.name}` : "best daily streak"}
                        />
                        <SummaryTile
                            value={`${summary.doneThisPeriod} of ${summary.habitCount}`}
                            label="done this period"
                        />
                    </section>

                    <section className="space-y-4 rounded-2xl border p-6">
                        <h2 className="text-lg font-bold">By habit</h2>
                        {habits.map(habit => (
                            <HabitBar key={habit.id} habit={habit} />
                        ))}
                    </section>

                    {daily.length > 0 && (
                        <section className="space-y-4 rounded-2xl border p-6">
                            <div className="flex items-baseline justify-between gap-4">
                                <h2 className="text-lg font-bold">Daily</h2>
                                <span className="text-sm text-muted-foreground">{dayLabel(from)} – {dayLabel(to)}</span>
                            </div>
                            {daily.map(habit => (
                                <DayStrip key={habit.id} habit={habit} days={days} />
                            ))}
                        </section>
                    )}
                </>
            )}
        </div>
    )
}

export default Stats
