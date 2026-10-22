import { DAYS, LEVEL_MIX, maxCount, monthTicks, towerHeight, weekRange, countLabel, type SkylineWeek } from "./data"

// Server-rendered oblique projection of the same city. Shown while the 3D
// scene loads, and on its own for reduced motion or when WebGL is missing.
const CELL = 10
const TOWER = 7.6
const UNIT = 9 // svg units per 3D height unit
const DX = 0.55 * CELL // each row further back shifts right...
const DY = 0.36 * CELL // ...and up

const fill = (level: number, shade: number) => {
  const base = `color-mix(in oklab, var(--signal) ${LEVEL_MIX[level] * 100}%, var(--rule))`
  return shade === 0 ? base : `color-mix(in oklab, ${base}, ${shade > 0 ? "white" : "black"} ${Math.abs(shade)}%)`
}

export function SkylineFallback({ weeks, joinIndex }: { weeks: SkylineWeek[]; joinIndex: number }) {
  const max = maxCount(weeks)
  const top = towerHeight(max, max) * UNIT + DAYS * DY
  const width = weeks.length * CELL + DAYS * DX
  const height = top + 26
  const ground = height - 18

  // On narrow screens the drawing keeps a readable size and scrolls sideways;
  // row-reverse makes the scroll start at the most recent weeks.
  return (
    <div className="flex h-full flex-row-reverse overflow-x-auto">
      <svg
        viewBox={`-4 -4 ${width + 8} ${height + 8}`}
        className="h-full w-full min-w-[720px] shrink-0"
        role="img"
        aria-label="Contribution history over the last year"
      >
        {weeks.map((w, wi) => (
          <g key={w.start}>
            <title>{`${weekRange(w)}: ${countLabel(w.total)}`}</title>
            {/* Back row (Sunday) first so nearer rows paint over it. */}
            {w.counts.map((count, d) => {
              if (count < 0) return null
              const depth = DAYS - 1 - d
              const x = wi * CELL + depth * DX
              const y = ground - depth * DY
              const h = towerHeight(count, max) * UNIT
              const ox = TOWER * 0.55
              const oy = TOWER * 0.36
              const level = w.levels[d]
              return (
                <g key={d}>
                  <rect x={x} y={y - h} width={TOWER} height={h} style={{ fill: fill(level, -12) }} />
                  <polygon
                    points={`${x + TOWER},${y} ${x + TOWER + ox},${y - oy} ${x + TOWER + ox},${y - h - oy} ${x + TOWER},${y - h}`}
                    style={{ fill: fill(level, -28) }}
                  />
                  <polygon
                    points={`${x},${y - h} ${x + TOWER},${y - h} ${x + TOWER + ox},${y - h - oy} ${x + ox},${y - h - oy}`}
                    style={{ fill: fill(level, 18) }}
                  />
                </g>
              )
            })}
          </g>
        ))}

        {joinIndex >= 0 && (
          <g className="fill-ink stroke-ink">
            <line x1={joinIndex * CELL + 4} x2={joinIndex * CELL + 4} y1={ground - 30} y2={6} strokeWidth="0.8" />
            <text x={joinIndex * CELL + 7} y={10} className="stroke-0" fontSize={5.5}>
              Joined WSO2
            </text>
          </g>
        )}

        {monthTicks(weeks).map((t) => (
          <text key={t.index} x={t.index * CELL} y={height} className="fill-graphite" fontSize={5}>
            {t.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
