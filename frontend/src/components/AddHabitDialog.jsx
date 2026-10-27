import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

function AddHabitDialog ({ onAddHabit }) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [frequency, setFrequency] = useState("daily")
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return

        try {
            await onAddHabit({ name, frequency }) // cekaj da Dashboard spremi naviku na backend
            // ovo ispod izvrši samo ako je spremanje uspjelo
            setName("")
            setFrequency("daily")
            setError(null)
            setOpen(false)
        } catch (err) {
            // spremanje nije uspjelo: dijalog ostaje otvoren i pokaže poruku
            setError(err.response?.data?.message || "Could not add habit")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Habit
                </Button>
            </DialogTrigger>

            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Habit</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Habit name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange = {(e) => setName(e.target.value)}
                                placeholder="e.g. Morning run"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="frequency">Frequency</Label>
                            <select
                                id="frequency"
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full border rounded-md px-3 py-2 text-sm"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>
                    { error && <p className="text-sm text-destructive">{error}</p>}
                    <DialogFooter>
                        <Button type="submit">Save Habit</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddHabitDialog