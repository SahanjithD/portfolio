import Image from "next/image"
import { Pipeline } from "@/components/pipeline"
import type { Project } from "@/lib/content"

// Figures come from each project's own outputs (exported into
// public/assets/projects), so what's shown is what the code produced.

const families = [
  { file: "adialer-c", name: "Adialer.C", w: 212, h: 169 },
  { file: "agent-fyi", name: "Agent.FYI", w: 86, h: 338 },
  { file: "allaple-a", name: "Allaple.A", w: 164, h: 169 },
  { file: "allaple-l", name: "Allaple.L", w: 94, h: 338 },
]

function MalwareFigure() {
  return (
    <div className="grid grid-cols-[repeat(4,minmax(0,1fr))] gap-3 sm:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.7fr)]">
      {families.map((f) => (
        <div key={f.file} className="flex flex-col">
          <div className="relative aspect-[3/5] overflow-hidden rounded bg-[#111]">
            <Image
              src={`/assets/projects/malware-${f.file}.webp`}
              alt={`A ${f.name} sample rendered as a grayscale image`}
              fill
              sizes="120px"
              className="object-cover [image-rendering:pixelated]"
            />
          </div>
          <span className="mt-1.5 truncate font-mono text-[0.7rem] text-graphite">{f.name}</span>
        </div>
      ))}
      <div className="col-span-4 flex flex-col sm:col-span-1">
        <div className="relative aspect-square overflow-hidden rounded">
          <Image
            src="/assets/projects/malware-gradcam.webp"
            alt="Grad-CAM heat map highlighting a band of bytes near the end of a Yuner.A sample"
            fill
            sizes="(min-width: 640px) 220px, 100vw"
            className="object-cover"
          />
        </div>
        <span className="mt-1.5 font-mono text-[0.7rem] text-graphite">Grad-CAM, Yuner.A</span>
      </div>
    </div>
  )
}

function SteganographyFigure() {
  const maps = [
    { file: "seq", label: "Sequential LSB" },
    { file: "prng", label: "Keyed PRNG LSB" },
  ]
  return (
    <div className="grid grid-cols-2 gap-4">
      {maps.map((m) => (
        <div key={m.file}>
          <div className="relative aspect-square overflow-hidden rounded border border-rule bg-surface">
            <Image
              src={`/assets/projects/steg-diff-${m.file}.webp`}
              alt={`Pixels changed by ${m.label} at 50% capacity`}
              fill
              sizes="(min-width: 1024px) 280px, 45vw"
              className="object-cover [image-rendering:pixelated]"
            />
          </div>
          <span className="mt-2 block text-sm font-medium">{m.label}</span>
        </div>
      ))}
    </div>
  )
}

export function ProjectVisual({ project, color }: { project: Project; color: string }) {
  if (project.visual === "malware") return <MalwareFigure />
  if (project.visual === "steganography") return <SteganographyFigure />
  return project.lanes ? <Pipeline lanes={project.lanes} color={color} /> : null
}
