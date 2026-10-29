import { useState } from "react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Archive } from "lucide-react"

// mala ikona pokraj imena navike; klik otvori potvrdu "Archive ...?"
// habit = navika, onArchive() = Dashboard je arhivira na backendu i makne s popisa
function ArchiveHabitDialog({ habit, onArchive }) {
    const [error, setError] = useState(null)

    const handleArchive = async () => {
        try {
            await onArchive()
        } catch (err) {
            setError(err.response?.data?.message || "Could not archive habit")
        }
    }

    return (
        // kod svakog otvaranja/zatvaranja makni staru poruku o grešci
        <Dialog onOpenChange={() => setError(null)}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon-xs" aria-label={`Archive ${habit.name}`} className="text-muted-foreground">
                    <Archive />
                </Button>
            </DialogTrigger>

            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Archive “{habit.name}”?</DialogTitle>
                    <DialogDescription>It leaves your dashboard. Its history is kept.</DialogDescription>
                </DialogHeader>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleArchive}>Archive</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ArchiveHabitDialog