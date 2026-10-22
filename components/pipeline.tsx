import type { Project } from "@/lib/content"

// Draws each lane of a project as boxes joined by a cable in the project's
// domain colour, so the diagram reads left to right like the data does.
export function Pipeline({ lanes, color }: { lanes: Project["lanes"]; color: string }) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <div className="grid min-w-max gap-3">
        {lanes.map((lane) => (
          <div key={lane.label} className="flex items-center">
            <span className="w-[4.5rem] shrink-0 text-sm text-graphite">{lane.label}</span>
            <ol aria-label={`${lane.label} path`} className="flex items-center">
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
    </div>
  )
}
