import { cn } from "@/lib/utils"
import { addDays } from "@/utils/calendar"
import ArchiveHabitDialog from "@/components/ArchiveHabitDialog"

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// mali kalendar jedne dnevne navike za tekući mjesec
// habit = navika s backenda (ima dates i streak), weeks = monthGrid(today), onToggle(date, isDone) = klik na dan
function HabitCalendar({ habit, weeks, onToggle, onArchive }) {
    // je li navika odrađena tog dana? (habit.dates je niz datuma 'YYYY-MM-DD')
    const isDone = (date) => habit.dates.includes(date)

    return (
        <div className="w-[266px] space-y-3">
            <div>
                <div className="flex items-center gap-1">
                    <p className="font-semibold">{habit.name}</p>
                    <ArchiveHabitDialog habit={habit} onArchive={onArchive} />
                </div>
                <p className="flex items-baseline gap-1.5">
                    <span className={cn("text-3xl font-bold", habit.streak > 0 ? "text-habit" : "text-muted-foreground")}>
                        {habit.streak}
                    </span> 
                    <span className="text-sm text-muted-foreground">
                        {habit.streak === 1 ? "day in a row" : "days in a row"}
                    </span>
                </p>
            </div>

            <div className="space-y-1">
                <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
                    {WEEKDAYS.map(name => <span key={name}>{name}</span>)}
                </div>

                {weeks.map(week => (
                    <div key={week[0].date} className="grid grid-cols-7">
                        {week.map(day => {
                            // dan susjednog mjeseca: samo sivi broj, ne moze se kliknuti
                            if (!day.inMonth) {
                                return (
                                    <span key={day.date} className="flex h-8 items-center justify-center text-sm text-muted-foreground">
                                        {day.day}
                                    </span>
                                )
                            }                        
                            const done = isDone(day.date)
                            // traka: zaobljen je samo kraj niza (lijevo ako dan prije nije odrađen, desno ako dan poslije nije)
                            const roundLeft = !isDone(addDays(day.date, -1))
                            const roundRight = !isDone(addDays(day.date, 1))

                            return (
                                <button
                                    key={day.date}
                                    type="button"
                                    disabled={day.isFuture}
                                    onClick={() => onToggle(day.date, done)}
                                    aria-pressed={done}
                                    aria-label={`${habit.name}, ${day.date}`}
                                    className={cn(
                                        "h-8 text-sm font-semibold",
                                        done ? "bg-habit text-white" : "bg-habit/15",
                                        done && roundLeft && "rounded-l-lg",
                                        done && roundRight && "rounded-r-lg",
                                        day.isToday && "underline decoration-2 underline-offset-4",
                                        !day.isFuture && "cursor-pointer"
                                    )}
                                >
                                    {day.day}
                                </button>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HabitCalendar
