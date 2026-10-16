import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Home, ListChecks, BarChart3, LogOut, NotebookPen, Waypoints, Settings  } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Habits", url: "/habits", icon: ListChecks },
  { title: "Diary", url: "/diary", icon: NotebookPen },
  { title: "Plans", url: "/plans", icon: Waypoints },
  { title: "Stats", url: "/stats", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings }, 
]

export function AppSidebar({ ...props }) {
  const navigate = useNavigate()

  const { logout } = useAuth() // funckija za odjavu 

  const handleLogout = async () => {
    await logout() // backend obriše cookie, a context zaboravi korisnika ( user = null )
    navigate("/login")
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h2 className="text-lg font-bold px-2 py-1">Self improwment tool</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}