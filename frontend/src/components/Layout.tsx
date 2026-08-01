import { Link, NavLink, Outlet } from "react-router-dom"
import { Scale } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/upload", label: "Upload" },
  { to: "/chat", label: "Chat" },
]

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Scale className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Legal<span className="text-accent">Analyzer</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
          <p>
            LegalAnalyzer provides AI-generated information for research and convenience
            only. It is <span className="font-medium text-foreground">not legal advice</span>.
          </p>
          <p>Always consult a qualified attorney before making legal decisions.</p>
        </div>
      </footer>
    </div>
  )
}
