"use client"

import { useState } from "react"
import Image from "next/image"
import * as Dialog from "@radix-ui/react-dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { Competition } from "@/lib/content"
import { cn } from "@/lib/utils"

export function CompetitionGallery({
  competition,
  onOpenChange,
}: {
  competition: Competition | null
  onOpenChange: (open: boolean) => void
}) {
  const [index, setIndex] = useState(0)
  const photos = competition?.photos ?? []
  const many = photos.length > 1

  const go = (delta: number) => setIndex((i) => (i + delta + photos.length) % photos.length)

  return (
    <Dialog.Root open={competition !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-[#05090e]/80 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          onKeyDown={(e) => {
            if (!many) return
            if (e.key === "ArrowRight") go(1)
            if (e.key === "ArrowLeft") go(-1)
          }}
          className="dialog-content fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[min(64rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg bg-paper shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
        >
          {competition && (
            <>
              <div className="relative h-[min(62vh,560px)] bg-[#05090e]">
                {photos.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`${competition.event}, photo ${i + 1} of ${photos.length}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className={cn(
                      "object-contain transition-opacity duration-300",
                      i === index ? "opacity-100" : "opacity-0",
                    )}
                    priority={i === 0}
                  />
                ))}
                {many && (
                  <>
                    <GalleryButton label="Previous photo" className="left-3" onClick={() => go(-1)}>
                      <ChevronLeft className="size-5" />
                    </GalleryButton>
                    <GalleryButton label="Next photo" className="right-3" onClick={() => go(1)}>
                      <ChevronRight className="size-5" />
                    </GalleryButton>
                    <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded bg-black/55 px-2 py-0.5 font-mono text-xs text-white/85">
                      {index + 1} of {photos.length}
                    </p>
                  </>
                )}
                <Dialog.Close
                  aria-label="Close"
                  className="absolute right-3 top-3 grid size-10 place-items-center rounded-md bg-black/55 text-white/85 transition-colors hover:bg-black/75 hover:text-white"
                >
                  <X className="size-5" />
                </Dialog.Close>
              </div>

              <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-8">
                <div>
                  <p className="text-sm text-graphite">
                    {competition.kind}, {competition.result}
                  </p>
                  <Dialog.Title className="mt-1 font-semiwide text-2xl font-bold tracking-[-0.02em] md:text-3xl">
                    {competition.event}
                  </Dialog.Title>
                  <p className="mt-3 max-w-[60ch]">{competition.summary}</p>
                </div>
                {many && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {photos.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        aria-label={`Show photo ${i + 1}`}
                        aria-current={i === index}
                        onClick={() => setIndex(i)}
                        className={cn(
                          "relative size-14 shrink-0 overflow-hidden rounded border-2 transition-[border-color,opacity] duration-150",
                          i === index ? "border-signal" : "border-transparent opacity-60 hover:opacity-100",
                        )}
                      >
                        <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function GalleryButton({
  label,
  className,
  onClick,
  children,
}: {
  label: string
  className: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-md bg-black/55 text-white/85 transition-colors hover:bg-black/75 hover:text-white",
        className,
      )}
    >
      {children}
    </button>
  )
}
