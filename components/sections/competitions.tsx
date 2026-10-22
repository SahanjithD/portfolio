"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { CompetitionGallery } from "@/components/competition-gallery"
import { SectionHeading } from "@/components/section-heading"
import { competitions, type Competition } from "@/lib/content"
import { cn } from "@/lib/utils"

const counts = competitions.reduce<Record<string, number>>((acc, c) => {
  acc[c.kind] = (acc[c.kind] ?? 0) + 1
  return acc
}, {})

export function Competitions() {
  const [open, setOpen] = useState<Competition | null>(null)
  const [preview, setPreview] = useState<Competition | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Follow the pointer without re-rendering on every move.
  const track = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return
    previewRef.current?.style.setProperty("translate", `${e.clientX + 24}px ${e.clientY - 90}px`)
  }

  return (
    <section aria-labelledby="competitions" className="shell py-20">
      <SectionHeading id="competitions" title="Competitions">
        {competitions.length} events so far: {counts.Hackathon} hackathons, {counts.CTF} capture-the-flags, a dev
        challenge and a 24-hour coding contest, with two runner-up finishes. Select an event to see photos from it.
      </SectionHeading>

      <div className="hidden grid-cols-[10rem_minmax(0,1fr)_10rem_5rem] gap-6 border-b border-rule pb-3 text-sm text-graphite md:grid">
        <span>Result</span>
        <span>Event</span>
        <span>Format</span>
        <span className="text-right">Photos</span>
      </div>

      <ul onPointerMove={track} onPointerLeave={() => setPreview(null)}>
        {competitions.map((c) => (
          <li key={c.event} className="border-b border-rule">
            <button
              type="button"
              onClick={() => setOpen(c)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setPreview(c)}
              className="group grid w-full grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 py-4 text-left md:grid-cols-[10rem_minmax(0,1fr)_10rem_5rem] md:gap-6 md:py-5"
            >
              <span className="relative row-span-2 aspect-square overflow-hidden rounded md:hidden">
                <Image src={c.photos[0]} alt="" fill sizes="72px" className="object-cover" />
              </span>
              <span
                className={cn(
                  "text-[0.95rem] md:order-none",
                  c.podium ? "font-semibold text-signal-ink" : "text-graphite md:text-ink",
                )}
              >
                {c.result}
              </span>
              <span className="col-start-2 font-semiwide text-lg font-semibold leading-snug tracking-[-0.01em] transition-colors group-hover:text-signal-ink md:col-start-auto md:text-xl">
                {c.event}
              </span>
              <span className="hidden text-graphite md:block">{c.kind}</span>
              <span className="hidden text-right font-mono text-sm text-graphite md:block">{c.photos.length}</span>
            </button>
          </li>
        ))}
      </ul>

      <div
        ref={previewRef}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-30 hidden h-[180px] w-[270px] overflow-hidden rounded-md shadow-[0_18px_50px_rgba(13,27,42,0.28)] transition-[opacity,scale] duration-200 ease-out md:block",
          preview ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
      >
        {competitions.map((c) => (
          <Image
            key={c.event}
            src={c.photos[0]}
            alt=""
            fill
            sizes="270px"
            className={cn("object-cover", preview === c ? "opacity-100" : "opacity-0")}
          />
        ))}
      </div>

      <CompetitionGallery competition={open} onOpenChange={(o) => !o && setOpen(null)} />
    </section>
  )
}
