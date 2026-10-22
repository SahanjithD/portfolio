"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import dynamic from "next/dynamic"
import { X } from "lucide-react"
import { countLabel, weekRange, type SkylineWeek } from "./data"
import { cn } from "@/lib/utils"

const Scene = dynamic(() => import("./scene"), { ssr: false })

let webgl: boolean | undefined
const hasWebGL = () => {
  if (webgl === undefined) {
    try {
      const canvas = document.createElement("canvas")
      webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"))
    } catch {
      webgl = false
    }
  }
  return webgl
}

const media = (query: string) => ({
  subscribe: (cb: () => void) => {
    const mq = window.matchMedia(query)
    mq.addEventListener("change", cb)
    return () => mq.removeEventListener("change", cb)
  },
  get: () => window.matchMedia(query).matches,
})
const reducedMotion = media("(prefers-reduced-motion: reduce)")
const finePointer = media("(hover: hover) and (pointer: fine)")

const themeClass = {
  subscribe: (cb: () => void) => {
    const mo = new MutationObserver(cb)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => mo.disconnect()
  },
  get: () => document.documentElement.className,
}

const useExternal = (store: { subscribe: (cb: () => void) => () => void; get: () => boolean | string }, server: boolean | string) =>
  useSyncExternalStore(store.subscribe, store.get, () => server)

type Card = { week: number; x: number; y: number; width: number; height: number }

export function Skyline({
  weeks,
  joinIndex,
  children,
}: {
  weeks: SkylineWeek[]
  joinIndex: number
  // The server-rendered SVG version, shown until (or instead of) the 3D scene.
  children: React.ReactNode
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const reduce = useExternal(reducedMotion, true) as boolean
  const interactive = useExternal(finePointer, false) as boolean
  const themeKey = useExternal(themeClass, "") as string
  const use3D = useSyncExternalStore(() => () => {}, hasWebGL, () => false) && !reduce

  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(true)
  const [hover, setHover] = useState<Card | null>(null)
  const [pinned, setPinned] = useState<Card | null>(null)
  const card = pinned ?? hover

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!pinned) return
    const close = (e: KeyboardEvent) => e.key === "Escape" && setPinned(null)
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [pinned])

  const at = (week: number | null, x: number, y: number): Card | null => {
    const rect = wrap.current?.getBoundingClientRect()
    return week === null || !rect ? null : { week, x: x - rect.left, y: y - rect.top, width: rect.width, height: rect.height }
  }

  return (
    <div ref={wrap} className={cn("relative h-[clamp(300px,48vh,520px)]", hover && interactive && "cursor-pointer")}>
      <div
        aria-hidden={use3D && ready}
        className={cn("absolute inset-0 transition-opacity duration-500", use3D && ready ? "opacity-0" : "opacity-100")}
      >
        {children}
      </div>

      {use3D && (
        <div className={cn("absolute inset-0 transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}>
          <Scene
            weeks={weeks}
            joinIndex={joinIndex}
            active={active}
            interactive={interactive}
            themeKey={themeKey}
            hovered={card?.week ?? null}
            onReady={() => setReady(true)}
            onHover={(week, x, y) => setHover(at(week, x, y))}
            onSelect={(week, x, y) => setPinned(at(week, x, y))}
          />
        </div>
      )}

      {card && (
        <WeekCard
          week={weeks[card.week]}
          x={card.x}
          y={card.y}
          bounds={card.width}
          above={card.y > card.height / 2}
          pinned={pinned !== null}
          onClose={() => setPinned(null)}
        />
      )}
    </div>
  )
}

function WeekCard({
  week,
  x,
  y,
  bounds,
  above,
  pinned,
  onClose,
}: {
  week: SkylineWeek
  x: number
  y: number
  bounds: number
  // In the lower half the card opens upwards so it stays on screen.
  above: boolean
  pinned: boolean
  onClose: () => void
}) {
  const width = 280
  const left = Math.min(Math.max(x + 16, 8), Math.max(bounds - width - 8, 8))
  const shown = week.merged.slice(0, 3)

  return (
    <div
      role={pinned ? "dialog" : undefined}
      aria-label={pinned ? weekRange(week) : undefined}
      className={cn(
        "absolute z-10 rounded-md bg-ink p-4 text-paper shadow-[0_18px_50px_rgba(13,27,42,0.3)]",
        pinned ? "pointer-events-auto" : "pointer-events-none",
      )}
      style={{ left, top: above ? y - 12 : y + 12, width, translate: above ? "0 -100%" : undefined }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{weekRange(week)}</p>
          <p className="text-sm text-paper/75">{countLabel(week.total)}</p>
        </div>
        {pinned && (
          <button type="button" onClick={onClose} aria-label="Close" className="-m-1 p-1 text-paper/70 hover:text-paper">
            <X className="size-4" />
          </button>
        )}
      </div>
      {shown.length > 0 && (
        <ul className="mt-3 space-y-2 border-t border-paper/15 pt-3 text-sm">
          {shown.map((pr) => (
            <li key={pr.url}>
              <a href={pr.url} target="_blank" rel="noreferrer" className="hover:underline">
                {pr.title}
              </a>
              <span className="block font-mono text-xs text-paper/60">{pr.repo}</span>
            </li>
          ))}
          {week.merged.length > shown.length && (
            <li className="text-paper/60">and {week.merged.length - shown.length} more merged</li>
          )}
        </ul>
      )}
    </div>
  )
}
