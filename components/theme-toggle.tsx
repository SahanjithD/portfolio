"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      // The resolved theme is unknown during SSR, so the label stays generic.
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark theme"
      className="grid size-9 place-items-center rounded-md text-graphite transition-colors hover:text-ink"
    >
      {/* Both icons render on the server; CSS picks one so there's no flash. */}
      <Sun className="hidden size-[18px] dark:block" />
      <Moon className="size-[18px] dark:hidden" />
    </button>
  )
}
