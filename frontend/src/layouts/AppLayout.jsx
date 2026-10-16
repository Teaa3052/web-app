import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

// Zajednički izgled svih zaštićenih stranica: sidebar lijevo, sadržaj stranice desno.
// <Outlet /> je mjesto gdje React Router ubaci trenutnu stranicu (Dashboard, Habits...)
function AppLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* gornja traka s gumbom za sidebar (na mobitelu otvara izbornik) */}
                <header className="flex h-14 items-center border-b px-4">
                    <SidebarTrigger />
                </header>
                <div className="p-6">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AppLayout
