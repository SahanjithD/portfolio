"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { DAYS, LEVEL_MIX, maxCount, monthTicks, towerHeight, type SkylineWeek } from "./data"

const PITCH = 1
const SIZE = 0.8
const PLINTH = 0.5
const POLAR = 1.05
const MARKER = 3.2 // how far the "Joined WSO2" flag rises above its week
const ORIGIN = new THREE.Vector3(0, 1.2, 0)
const CITY = "city"
// Scratch objects reused every frame.
const scratch = new THREE.Object3D()
const v = new THREE.Vector3()

export type SceneProps = {
  weeks: SkylineWeek[]
  joinIndex: number
  active: boolean
  interactive: boolean
  themeKey: string
  hovered: number | null
  onReady: () => void
  onHover: (week: number | null, x: number, y: number) => void
  onSelect: (week: number | null, x: number, y: number) => void
}

type Label = { key: string; text: string; at: THREE.Vector3; strong?: boolean }

const css = (name: string) => new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim())
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

export default function Scene(props: SceneProps) {
  const { weeks, joinIndex } = props
  // Once someone drags the city, the idle sway stops for good.
  const touched = useRef(false)
  const labelEls = useRef<(HTMLSpanElement | null)[]>([])

  const max = useMemo(() => maxCount(weeks), [weeks])
  const cx = (weeks.length - 1) / 2
  const cz = (DAYS - 1) / 2
  const joinTop = joinIndex >= 0 ? Math.max(...weeks[joinIndex].counts.map((c) => towerHeight(c, max))) + MARKER : 0
  const top = Math.max(towerHeight(max, max), joinTop) + 0.4

  // Labels are plain DOM positioned from the render loop, so they stay crisp
  // and need no extra React roots.
  const labels = useMemo<Label[]>(() => {
    const months = monthTicks(weeks).map((t) => ({
      key: `m${t.index}`,
      text: t.label,
      at: new THREE.Vector3((t.index - cx) * PITCH, -PLINTH, cz + 1.3),
    }))
    const join =
      joinIndex >= 0
        ? [{ key: "join", text: "Joined WSO2", at: new THREE.Vector3((joinIndex - cx) * PITCH, joinTop, -cz - 0.2), strong: true }]
        : []
    return [...months, ...join]
  }, [cx, cz, joinIndex, joinTop, weeks])

  return (
    <div className="relative h-full w-full">
      <Canvas
        orthographic
        dpr={[1, 2]}
        frameloop={props.active ? "always" : "never"}
        camera={{ near: 0.1, far: 1000, zoom: 10 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={props.onReady}
        onPointerMissed={() => props.onSelect(null, 0, 0)}
        style={{ touchAction: props.interactive ? "none" : "pan-y" }}
      >
        <hemisphereLight args={["#ffffff", "#8090a0", 1.6]} />
        <directionalLight position={[-18, 30, 22]} intensity={1.9} />
        <City {...props} max={max} cx={cx} cz={cz} joinTop={joinTop} touched={touched} />
        <CameraRig length={weeks.length} top={top} interactive={props.interactive} />
        <LabelProjector labels={labels} els={labelEls} />
        {props.interactive && (
          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            minPolarAngle={0.6}
            maxPolarAngle={1.35}
            onStart={() => (touched.current = true)}
          />
        )}
      </Canvas>

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {labels.map((l, i) => (
          <span
            key={l.key}
            ref={(el) => {
              labelEls.current[i] = el
            }}
            className={
              l.strong
                ? "absolute left-0 top-0 whitespace-nowrap pl-2 text-xs font-medium text-ink"
                : "absolute left-0 top-0 -translate-x-1/2 text-[11px] text-graphite"
            }
            style={{ visibility: "hidden" }}
          >
            {l.text}
          </span>
        ))}
      </div>
    </div>
  )
}

function LabelProjector({ labels, els }: { labels: Label[]; els: React.RefObject<(HTMLSpanElement | null)[]> }) {
  useFrame(({ camera, size, scene }) => {
    const g = scene.getObjectByName(CITY)
    if (!g) return
    labels.forEach((l, i) => {
      const el = els.current[i]
      if (!el) return
      v.copy(l.at).applyMatrix4(g.matrixWorld).project(camera)
      const x = ((v.x + 1) / 2) * size.width
      const y = ((1 - v.y) / 2) * size.height
      el.style.transform = `translate(${x.toFixed(1)}px, ${(y - (l.strong ? 8 : 0)).toFixed(1)}px)${l.strong ? "" : " translateX(-50%)"}`
      el.style.visibility = "visible"
    })
  })
  return null
}

// Fits the city's bounding box to the viewport with an orthographic camera.
// Wide screens see the year side on; narrow ones look along it diagonally.
type Controls = { target: THREE.Vector3; minAzimuthAngle: number; maxAzimuthAngle: number; update: () => void }

function CameraRig({ length, top, interactive }: { length: number; top: number; interactive: boolean }) {
  const get = useThree((s) => s.get)
  const size = useThree((s) => s.size)
  // Controls mount after the camera; refit once they exist.
  const hasControls = useThree((s) => s.controls !== null)

  useLayoutEffect(() => {
    const state = get()
    const camera = state.camera as THREE.OrthographicCamera
    const controls = state.controls as unknown as Controls | null
    const aspect = size.width / Math.max(size.height, 1)
    const azimuth = aspect >= 1.8 ? 0.42 : aspect >= 1.2 ? 0.7 : 1.1
    const aim = (target: THREE.Vector3) => {
      camera.position.setFromSpherical(new THREE.Spherical(200, POLAR, azimuth)).add(target)
      camera.lookAt(target)
      camera.updateMatrixWorld()
    }
    aim(ORIGIN)

    const hx = (length * PITCH) / 2 + 0.6
    const hz = (DAYS * PITCH) / 2 + 0.6
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    for (const x of [-hx, hx]) for (const y of [-PLINTH, top]) for (const z of [-hz, hz]) {
      v.set(x, y, z).applyMatrix4(camera.matrixWorldInverse)
      minX = Math.min(minX, v.x)
      maxX = Math.max(maxX, v.x)
      minY = Math.min(minY, v.y)
      maxY = Math.max(maxY, v.y)
    }

    // Leave room below for the month labels.
    camera.zoom = Math.min(size.width / (maxX - minX), (size.height - 28) / (maxY - minY)) * (aspect < 1.2 ? 0.88 : 0.94)
    const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0)
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1)
    const target = ORIGIN.clone()
      .addScaledVector(right, (minX + maxX) / 2)
      .addScaledVector(up, (minY + maxY) / 2 - 14 / camera.zoom)
    aim(target)
    camera.updateProjectionMatrix()

    if (controls) {
      controls.target.copy(target)
      // Keep orbiting near the framed view so the city never leaves the frame.
      controls.minAzimuthAngle = azimuth - 0.5
      controls.maxAzimuthAngle = azimuth + 0.5
      controls.update()
    }
  }, [get, hasControls, interactive, length, size.height, size.width, top])

  return null
}

function City({
  weeks,
  themeKey,
  hovered,
  onHover,
  onSelect,
  joinIndex,
  max,
  cx,
  cz,
  joinTop,
  touched,
}: SceneProps & {
  max: number
  cx: number
  cz: number
  joinTop: number
  touched: React.RefObject<boolean>
}) {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.InstancedMesh>(null)
  const born = useRef<number | null>(null)
  const settled = useRef(false)
  const count = weeks.length * DAYS
  const heights = useMemo(() => weeks.flatMap((w) => w.counts.map((c) => towerHeight(c, max))), [weeks, max])
  const geometry = useMemo(() => new THREE.BoxGeometry(SIZE, 1, SIZE).translate(0, 0.5, 0), [])
  const xOf = (week: number) => (week - cx) * PITCH
  const invalidate = useThree((s) => s.invalidate)

  const place = (progress: (week: number) => number) => {
    const m = mesh.current
    if (!m) return
    for (let i = 0; i < count; i++) {
      const week = Math.floor(i / DAYS)
      scratch.position.set(xOf(week), 0, ((i % DAYS) - cz) * PITCH)
      scratch.scale.setScalar(heights[i] === 0 ? 0 : 1)
      scratch.scale.y = Math.max(heights[i] * progress(week), 0.0001)
      scratch.updateMatrix()
      m.setMatrixAt(i, scratch.matrix)
    }
    m.instanceMatrix.needsUpdate = true
    m.computeBoundingSphere()
  }

  // Colours follow the theme tokens and darken the hovered week.
  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    const rule = css("--rule")
    const signal = css("--signal")
    const ink = css("--ink")
    const color = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const week = Math.floor(i / DAYS)
      color.copy(rule).lerp(signal, LEVEL_MIX[weeks[week].levels[i % DAYS]])
      if (week === hovered) color.lerp(ink, 0.3)
      m.setColorAt(i, color)
    }
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    invalidate()
  }, [count, hovered, invalidate, themeKey, weeks])

  // The one orchestrated moment: towers rise in a wave from left to right,
  // then the city sways gently until someone takes hold of it.
  useFrame(({ clock }) => {
    born.current ??= clock.elapsedTime
    const t = clock.elapsedTime - born.current
    if (!settled.current) {
      place((week) => easeOut(clamp01((t - (week / weeks.length) * 0.6) / 0.6)))
      if (t > 1.3) {
        settled.current = true
        place(() => 1)
      }
    }
    if (group.current && !touched.current) group.current.rotation.y = Math.sin(t * 0.18) * 0.05
  })

  const toWeek = (e: ThreeEvent<PointerEvent | MouseEvent>) =>
    e.instanceId === undefined ? null : Math.floor(e.instanceId / DAYS)

  // Recomputed on theme change; themeKey is the trigger.
  const [plinthColor, inkColor] = useMemo(() => {
    void themeKey
    return [css("--rule").lerp(css("--paper"), 0.35), css("--ink")]
  }, [themeKey])

  return (
    <group ref={group} name={CITY}>
      <mesh position={[0, -PLINTH / 2, 0]}>
        <boxGeometry args={[weeks.length * PITCH + 1.2, PLINTH, DAYS * PITCH + 1.2]} />
        <meshStandardMaterial color={plinthColor} roughness={0.95} />
      </mesh>

      <instancedMesh
        ref={mesh}
        args={[geometry, undefined, count]}
        onPointerMove={(e) => {
          e.stopPropagation()
          onHover(toWeek(e), e.nativeEvent.clientX, e.nativeEvent.clientY)
        }}
        onPointerOut={() => onHover(null, 0, 0)}
        onClick={(e) => {
          if (e.delta > 4) return // a drag to orbit, not a tap
          e.stopPropagation()
          onSelect(toWeek(e), e.nativeEvent.clientX, e.nativeEvent.clientY)
        }}
      >
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>

      {joinIndex >= 0 && (
        <mesh position={[xOf(joinIndex), joinTop / 2, -cz - 0.2]}>
          <boxGeometry args={[0.06, joinTop, 0.06]} />
          <meshBasicMaterial color={inkColor} />
        </mesh>
      )}
    </group>
  )
}
