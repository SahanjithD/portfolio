"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// A spine-leaf fabric run by a reactive OpenFlow controller. The first packet
// of a new flow is punted to the controller (packet-in), which installs rules
// on every switch along the path (flow-mod) before traffic is forwarded.
// Later packets of the same flow skip the controller until the rule expires.

type Kind = "controller" | "spine" | "leaf" | "host"
type Node = { id: string; kind: Kind; detail: string; x: number; y: number }
type Link = { a: number; b: number; tier: "control" | "fabric" | "edge" }
type Packet = {
  path: number[]
  seg: number
  t: number
  control: boolean
  onDone?: () => void
}
type Palette = Record<"ink" | "graphite" | "paper" | "surface" | "signal" | "fabric" | "edge" | "control" | "mono", string>

const CONTROLLER = 0
const SPINES = [1, 2]
const LEAVES = [3, 4, 5, 6]
const HOSTS = [7, 8, 9, 10, 11, 12, 13, 14]
const FLOW_TTL = 15_000
const DATA_SPEED = 0.24 // px per ms
const CONTROL_SPEED = 0.34
const INTRO_MS = 1300

const NODES: Omit<Node, "x" | "y">[] = [
  { id: "c0", kind: "controller", detail: "Ryu controller" },
  { id: "s1", kind: "spine", detail: "spine switch" },
  { id: "s2", kind: "spine", detail: "spine switch" },
  ...LEAVES.map((_, i) => ({ id: `l${i + 1}`, kind: "leaf" as const, detail: "leaf switch" })),
  ...HOSTS.map((_, i) => ({ id: `h${i + 1}`, kind: "host" as const, detail: `10.0.0.${i + 1}` })),
]

const LINKS: Link[] = [
  ...[...SPINES, ...LEAVES].map((b) => ({ a: CONTROLLER, b, tier: "control" as const })),
  ...SPINES.flatMap((a) => LEAVES.map((b) => ({ a, b, tier: "fabric" as const }))),
  ...HOSTS.map((b, i) => ({ a: LEAVES[Math.floor(i / 2)], b, tier: "edge" as const })),
]

const leafOf = (host: number) => LEAVES[Math.floor((host - HOSTS[0]) / 2)]
const pick = <T,>(xs: T[]) => xs[Math.floor(Math.random() * xs.length)]
const label = (i: number) => NODES[i].id

function layout(w: number, h: number): Node[] {
  const padX = Math.max(20, w * 0.04)
  const span = w - padX * 2
  const hostX = HOSTS.map((_, i) => padX + (span * i) / (HOSTS.length - 1))
  const leafX = LEAVES.map((_, i) => (hostX[i * 2] + hostX[i * 2 + 1]) / 2)
  const spineX = [(leafX[0] + leafX[1]) / 2, (leafX[2] + leafX[3]) / 2]
  const rows = { controller: 0.12, spine: 0.38, leaf: 0.63, host: 0.88 }

  return NODES.map((n, i) => {
    let x = w / 2
    if (n.kind === "spine") x = spineX[i - SPINES[0]]
    if (n.kind === "leaf") x = leafX[i - LEAVES[0]]
    if (n.kind === "host") x = hostX[i - HOSTS[0]]
    return { ...n, x, y: h * rows[n.kind] }
  })
}

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement)
  const v = (name: string) => css.getPropertyValue(name).trim()
  return {
    ink: v("--ink"),
    graphite: v("--graphite"),
    paper: v("--paper"),
    surface: v("--surface"),
    signal: v("--signal"),
    fabric: v("--cable-net"),
    edge: v("--cable-core"),
    control: v("--cable-ops"),
    mono: v("--font-plex-mono") || "monospace",
  }
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

export function Topology() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodes = useRef<Node[]>([])
  const packets = useRef<Packet[]>([])
  const flows = useRef(new Map<string, { path: number[]; expires: number }>())
  const hovered = useRef<number | null>(null)
  const reduced = useRef(false)
  // Lets pointer handlers repaint when nothing is animating (reduced motion).
  const repaint = useRef<() => void>(() => {})
  const [log, setLog] = useState<{ key: number; text: string }[]>([])
  const logKey = useRef(0)

  const write = useCallback((text: string) => {
    setLog((prev) => [...prev.slice(-3), { key: logKey.current++, text }])
  }, [])

  const send = useCallback(
    (path: number[], control: boolean) =>
      new Promise<void>((resolve) => {
        if (reduced.current) return resolve()
        packets.current.push({ path, seg: 0, t: 0, control, onDone: resolve })
      }),
    [],
  )

  const startFlow = useCallback(
    async (src: number, dst: number) => {
      const key = `${src}>${dst}`
      const flow = `${label(src)} → ${label(dst)}`
      const cached = flows.current.get(key)

      if (cached && cached.expires > performance.now()) {
        await send(cached.path, false)
        write(`${flow}  matched existing flow, ${cached.path.length - 1} hops`)
        return
      }

      const ingress = leafOf(src)
      const egress = leafOf(dst)
      const path = ingress === egress ? [src, ingress, dst] : [src, ingress, pick(SPINES), egress, dst]
      const switches = path.slice(1, -1)

      await send([src, ingress], false)
      write(`${flow}  packet-in from ${label(ingress)}`)
      await send([ingress, CONTROLLER], true)
      write(`c0  flow-mod to ${switches.map(label).join(", ")}`)
      await Promise.all(switches.map((s) => send([CONTROLLER, s], true)))
      flows.current.set(key, { path, expires: performance.now() + FLOW_TTL })
      await send(path.slice(1), false)
      write(`${flow}  delivered via ${label(path[2])}`)
    },
    [send, write],
  )

  const randomFlow = useCallback(
    (src = pick(HOSTS)) => {
      const dst = pick(HOSTS.filter((h) => h !== src))
      void startFlow(src, dst)
    },
    [startFlow],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    reduced.current = motion.matches
    let palette = readPalette()
    let width = 0
    let height = 0
    let frame = 0
    let visible = true
    let last = performance.now()
    const born = last

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = wrap.clientWidth
      height = wrap.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      nodes.current = layout(width, height)
      if (reduced.current) draw(performance.now())
    }

    const drawNode = (n: Node, alpha: number) => {
      ctx.globalAlpha = alpha
      ctx.lineWidth = 1.5
      if (n.kind === "controller") {
        ctx.fillStyle = palette.ink
        ctx.beginPath()
        ctx.roundRect(n.x - 17, n.y - 10, 34, 20, 4)
        ctx.fill()
        ctx.fillStyle = palette.paper
        ctx.font = `500 11px ${palette.mono}`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("c0", n.x, n.y + 0.5)
      } else if (n.kind === "host") {
        ctx.fillStyle = palette.ink
        ctx.beginPath()
        ctx.arc(n.x, n.y, 4.5, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillStyle = palette.surface
        ctx.strokeStyle = palette.ink
        ctx.beginPath()
        ctx.roundRect(n.x - 13, n.y - 7, 26, 14, 3)
        ctx.fill()
        ctx.stroke()
        // Port LEDs
        ctx.fillStyle = palette.ink
        for (let p = -1; p <= 1; p++) ctx.fillRect(n.x + p * 6 - 1.5, n.y - 1.5, 3, 3)
      }
      ctx.globalAlpha = 1
    }

    const draw = (now: number) => {
      const intro = reduced.current ? 1 : clamp01((now - born) / INTRO_MS)
      const ns = nodes.current
      ctx.clearRect(0, 0, width, height)

      // Links draw in tier by tier: control plane first, then fabric, then edge.
      for (const link of LINKS) {
        const delay = link.tier === "control" ? 0 : link.tier === "fabric" ? 0.2 : 0.4
        const p = easeOut(clamp01((intro - delay) / 0.6))
        if (p === 0) continue
        const a = ns[link.a]
        const b = ns[link.b]
        ctx.strokeStyle = palette[link.tier === "control" ? "control" : link.tier]
        ctx.globalAlpha = link.tier === "control" ? 0.55 : 0.5
        ctx.lineWidth = link.tier === "edge" ? 1.25 : 1.5
        ctx.setLineDash(link.tier === "control" ? [3, 5] : [])
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p)
        ctx.stroke()
      }
      ctx.setLineDash([])
      ctx.globalAlpha = 1

      const showHostLabels = width / HOSTS.length > 40
      ctx.font = `400 11px ${palette.mono}`
      ctx.textBaseline = "middle"
      ns.forEach((n, i) => {
        const tier = n.kind === "controller" ? 0 : n.kind === "spine" ? 0.15 : n.kind === "leaf" ? 0.3 : 0.45
        const alpha = easeOut(clamp01((intro - tier) / 0.5))
        if (alpha === 0) return
        drawNode(n, alpha)
        if (n.kind === "controller") return
        if (n.kind === "host" && !showHostLabels) return
        ctx.globalAlpha = alpha
        ctx.fillStyle = palette.graphite
        ctx.textAlign = n.kind === "host" ? "center" : "left"
        if (n.kind === "host") ctx.fillText(n.id, n.x, n.y + 16)
        else ctx.fillText(n.id, n.x + 18, n.y)
        ctx.globalAlpha = 1
        if (hovered.current === i) {
          ctx.strokeStyle = palette.signal
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(n.x, n.y, 15, 0, Math.PI * 2)
          ctx.stroke()
        }
      })

      for (const pk of packets.current) {
        const a = ns[pk.path[pk.seg]]
        const b = ns[pk.path[pk.seg + 1]]
        const x = a.x + (b.x - a.x) * pk.t
        const y = a.y + (b.y - a.y) * pk.t
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
        const tail = Math.min(pk.t, 22 / len)
        ctx.strokeStyle = pk.control ? palette.control : palette.signal
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(x - (b.x - a.x) * tail, y - (b.y - a.y) * tail)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.fillStyle = pk.control ? palette.control : palette.signal
        ctx.fillRect(x - 3.5, y - 3.5, 7, 7)
      }

      const h = hovered.current
      if (h !== null) {
        const n = ns[h]
        const text = `${n.id}  ${n.detail}`
        ctx.font = `500 12px ${palette.mono}`
        const tw = ctx.measureText(text).width + 16
        const tx = Math.min(Math.max(n.x - tw / 2, 4), width - tw - 4)
        const ty = n.kind === "host" ? n.y - 40 : n.y + 18
        ctx.fillStyle = palette.ink
        ctx.beginPath()
        ctx.roundRect(tx, ty, tw, 24, 4)
        ctx.fill()
        ctx.fillStyle = palette.paper
        ctx.textAlign = "left"
        ctx.fillText(text, tx + 8, ty + 12.5)
      }
    }

    const step = (now: number) => {
      const dt = Math.min(now - last, 50)
      last = now
      const ns = nodes.current
      const done: Packet[] = []
      for (const pk of packets.current) {
        const a = ns[pk.path[pk.seg]]
        const b = ns[pk.path[pk.seg + 1]]
        const len = Math.hypot(b.x - a.x, b.y - a.y) || 1
        pk.t += (dt * (pk.control ? CONTROL_SPEED : DATA_SPEED)) / len
        if (pk.t >= 1) {
          pk.seg += 1
          pk.t = 0
          if (pk.seg >= pk.path.length - 1) done.push(pk)
        }
      }
      if (done.length) {
        packets.current = packets.current.filter((p) => !done.includes(p))
        done.forEach((p) => p.onDone?.())
      }
      draw(now)
      frame = visible ? requestAnimationFrame(step) : 0
    }

    repaint.current = () => reduced.current && draw(performance.now())

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame && !reduced.current) {
        last = performance.now()
        frame = requestAnimationFrame(step)
      }
    })
    io.observe(wrap)

    // Repaint with the new palette when the theme class changes.
    const mo = new MutationObserver(() => {
      palette = readPalette()
      if (reduced.current) draw(performance.now())
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    if (!reduced.current) frame = requestAnimationFrame(step)

    // Background traffic, kept light so the diagram stays readable.
    const ambient = reduced.current
      ? undefined
      : window.setInterval(() => {
          if (visible && packets.current.length < 6) randomFlow()
        }, 2600)
    const first = reduced.current ? undefined : window.setTimeout(() => randomFlow(HOSTS[2]), INTRO_MS)

    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(ambient)
      window.clearTimeout(first)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
    }
  }, [randomFlow])

  const nodeAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    let best: number | null = null
    let bestDist = 24
    nodes.current.forEach((n, i) => {
      const d = Math.hypot(n.x - x, n.y - y)
      if (d < bestDist) {
        best = i
        bestDist = d
      }
    })
    return best
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-10">
      <div className="order-2 flex flex-col justify-end gap-4 lg:order-1">
        <ol aria-live="polite" className="space-y-1 lg:min-h-[6.5rem] font-mono text-[0.75rem] leading-relaxed text-graphite">
          {log.map((entry, i) => (
            <li key={entry.key} className={i === log.length - 1 ? "text-ink" : undefined}>
              {entry.text}
            </li>
          ))}
        </ol>
        <p className="text-sm text-graphite">
          A simulated SDN fabric. Click a host, or{" "}
          <button type="button" className="link text-ink" onClick={() => randomFlow()}>
            send a packet
          </button>
          .
        </p>
      </div>
      <div ref={wrapRef} className="order-1 h-[clamp(240px,34vh,380px)] lg:order-2">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Network diagram: a Ryu controller managing two spine switches, four leaf switches and eight hosts."
          className="h-full w-full touch-manipulation"
          onPointerMove={(e) => {
            const n = nodeAt(e)
            hovered.current = n
            e.currentTarget.style.cursor = n !== null && NODES[n].kind === "host" ? "pointer" : "default"
            repaint.current()
          }}
          onPointerLeave={() => {
            hovered.current = null
            repaint.current()
          }}
          onPointerDown={(e) => {
            const n = nodeAt(e)
            if (n !== null && NODES[n].kind === "host") randomFlow(n)
          }}
        />
      </div>
    </div>
  )
}
