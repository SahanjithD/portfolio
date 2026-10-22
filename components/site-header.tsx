"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { profile } from "@/lib/content"

export const sections = [
  { id: "projects", label: "Projects" },
  { id: "competitions", label: "Competitions" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <a href="#top" className="font-semiwide text-[0.95rem] font-bold tracking-tight">
          {profile.name}
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-[0.9rem] text-graphite transition-colors hover:text-ink">
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="grid size-9 place-items-center rounded-md text-graphite hover:text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Sections" hidden={!open} className="border-t border-rule md:hidden">
        <ul className="shell py-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={() => setOpen(false)} className="block py-3 text-lg">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
