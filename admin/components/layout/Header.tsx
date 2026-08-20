"use client"

import { Bell, ChevronDown, LogOut, User as UserIcon } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    router.push("/login")
  }

  const getBreadcrumb = () => {
    if (pathname === "/") return "Dashboard"
    const parts = pathname.split("/").filter(Boolean)
    return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" / ")
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-6 lg:h-[60px]">
      <div className="flex flex-1 items-center gap-4 text-sm font-semibold text-muted-foreground">
        {getBreadcrumb()}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-1 text-muted-foreground hover:bg-muted">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-destructive"></span>
        </button>
        
        <div className="relative group cursor-pointer flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-white">
            <UserIcon className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Admin</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
          
          <div className="absolute right-0 top-full mt-1 hidden w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md group-hover:block">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}