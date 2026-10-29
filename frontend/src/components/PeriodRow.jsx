import { cn } from "@/lib/utils"
import { periodStart } from "@/utils/calendar"
import ArchiveHabitDialog from "@/components/ArchiveHabitDialog"

// red tjedne ili mjesečne navike: ime + kvadratić za svaki period
// periods = monthWeeks(today) ili thisMonth(today), today = današnji datum, onToggle(date, isDone) = klik

function PeriodRow({ habit, periods, today, onToggle, onArchive }) {
    // datum zapisa koji pada u period koji počinje sa start (ili undefined ako ga nema)
    const findLog = (start) => habit.dates.find ( date => periodStart(date, habit.frequency) === start )


    return (
        <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
            <div className="flex w-40 items-center gap-1">
                <span className="truncate font-semibold leading-8">{habit.name}</span>
                <ArchiveHabitDialog habit={habit} onArchive={onArchive} />
            </div>
            <div className="flex">
                {periods.map((period, i) => {
                    const logDate = findLog(period.start)
                    const done = logDate !== undefined
                    // traka kao kod dnevnih: zaobljen je samo kraj niza odrađenih perioda
                    const roundLeft = i === 0 || !findLog(periods[i - 1].start)
                    const roundRight = i === periods.length - 1 || !findLog(periods[i +1].start)

                    // datum za backend: odrađeno -> baš taj zapis (da ga obrišemo),
                    // nije -> danas (tekući period) ili prvi dan perioda (prošli period)

                    const date = done ? logDate : (period.isCurrent ? today : period.start)

                    return (
                        // stupac: oznaka perioda iznad, prazan kvadratić ispod
                        <div key={period.start} className="flex flex-col items-center gap-1">
                            <span className={cn(
                                "text-xs text-muted-foreground",
                                period.isCurrent && "font-semibold text-foreground underline decoration-2 underline-offset-2"
                            )}>
                                {period.label} 
                            </span>
                            <button
                                type="button"
                                disabled={period.isFuture}
                                onClick={() => onToggle(date, done)}
                                aria-pressed={done}
                                aria-label={`${habit.name}, ${period.start}`}
                                className={cn(
                                    "h-8 w-[38px]",
                                    done ? "bg-habit" : "bg-habit/15",
                                    done && roundLeft && "rounded-l-lg",
                                    done && roundRight && "rounded-r-lg",
                                    !period.isFuture && "cursor-pointer"
                                )}
                            />
                        </div>
                    )
                })}
            </div>
        </div> 
        
    )
}

export default PeriodRow 