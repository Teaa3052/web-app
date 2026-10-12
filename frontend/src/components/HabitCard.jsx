// src/components/HabitCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Flame } from "lucide-react"

function HabitCard({ habit, onToggleToday }) {
  const { name, streak, doneToday } = habit

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{name}</CardTitle>
        <div className="flex items-center gap-1 text-orange-500 text-sm font-semibold">
          <Flame className="h-4 w-4" />
          {streak}
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <Checkbox
          checked={doneToday}
          onCheckedChange={() => onToggleToday(habit.id)}
          id={`habit-${habit.id}`}
        />
        <label htmlFor={`habit-${habit.id}`} className="text-sm text-muted-foreground">
          {doneToday ? "Odrađeno danas" : "Označi kao odrađeno"}
        </label>
      </CardContent>
    </Card>
  )
}

export default HabitCard