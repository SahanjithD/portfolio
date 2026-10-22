import type { Project } from "@/lib/content"

// Draws each lane of a project as boxes joined by a cable in the project's
// domain colour, so the diagram reads left to right like the data does.
// Lanes wrap on narrow screens rather than scrolling.
export function Pipeline({ lanes, color }: { lanes: NonNullable<Project["lanes"]>; color: string }) {
  return (
    <div className="grid gap-4 sm:gap-3">
      {lanes.map((lane) => (
        <div key={lane.label} className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
          <span className="w-18 shrink-0 text-sm text-graphite">{lane.label}</span>
          <ol aria-label={`${lane.label} path`} className="flex flex-wrap items-center gap-y-2">
            {lane.steps.map((step, i) => (
              <li key={step} className="flex items-center">
                {i > 0 && (
                  <svg aria-hidden width="30" height="10" viewBox="0 0 30 10" className="shrink-0">
                    <line x1="1" y1="5" x2="25" y2="5" stroke={color} strokeWidth="2" />
                    <path d="M23 1.5 27.5 5 23 8.5" fill="none" stroke={color} strokeWidth="2" />
                  </svg>
                )}
                <span className="whitespace-nowrap rounded border border-rule bg-surface px-2.5 py-1 text-[0.85rem]">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
