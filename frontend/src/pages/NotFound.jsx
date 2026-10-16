import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

// Prikazuje se za svaku adresu koja ne postoji (ruta "*" u App.jsx)
function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-muted-foreground">This page doesn't exist.</p>
            <Button asChild>
                <Link to="/homepage">Go home</Link>
            </Button>
        </div>
    )
}

export default NotFound
