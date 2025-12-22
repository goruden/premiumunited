import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { useMemo, useRef, useState } from "react"
import { tileSize } from "./MapData/constants"
import { rows } from "./MapData/metadata"

type Direction = "north" | "south" | "east" | "west"

type TrafficProps = {
  isActive?: boolean
}

type QuaternionStruct = { 
  x: number 
  y: number 
  z: number 
  w: number 
}
type TurnState = "idle" | "planned" | "turning"

type CarData = {
  id: number
  x: number
  y: number
  dir: Direction
  speed: number
  laneOffset: { 
    x: number 
    y: number 
  }
  orientation: QuaternionStruct
  model: "car1" | "car2" | "truck"
  bodyColor?: THREE.ColorRepresentation
  cabinColor?: THREE.ColorRepresentation

  turnState?: TurnState
  plannedDir?: Direction | null
  plannedTile?: { 
    x: number 
    y: number 
  } | null
  turningProgress?: number
  turnStartX?: number
  turnStartY?: number
  skipTurnTile?: { 
    x: number 
    y: number 
  } | null
}

const SIMPLE_CAR_PALETTE = [
  { body: 0xff5555, cabin: 0xffffff },
  { body: 0x2563eb, cabin: 0xffffff },
  { body: 0x22c55e, cabin: 0xf8fafc },
  { body: 0xf97316, cabin: 0x111827 },
  { body: 0xa855f7, cabin: 0xf5f5f5 },
] as const

type RoadTile = { 
  x: number 
  y: number 
  type: string 
}
type CarMarker = {
  x: number
  y: number
  dir: Direction
  model?: CarData["model"]
  forwardOffset?: number
  speed?: number
}

const CAR_MARKER_TYPES = new Set(["car", "car1", "car2", "truck", "simple"])

export function Traffic({ isActive = true }: TrafficProps) {
  const { scene: carScene } = useGLTF("/models/Car.glb")
  const { scene: carScene2 } = useGLTF("/models/chtruck.glb")
  const { scene: truckScene } = useGLTF("/models/cutruck.glb")

  const carVariants = useMemo(() => {
    const ensureFallback = () => {
      const g = new THREE.Group()
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(24, 12, 8),
        new THREE.MeshStandardMaterial({ color: 0x8b8b8b })
      )
      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(14, 10, 6),
        new THREE.MeshStandardMaterial({ color: 0xe5e7eb })
      )
      cabin.position.set(2, 0, 7);
      [body, cabin].forEach((m) => {
        m.castShadow = true
        m.receiveShadow = true
      })
      g.add(body, cabin)
      return g
    }

    const prepare = (src?: THREE.Group, options?: { rotateY?: number }) => {
      const base = src ? src.clone(true) : ensureFallback()
      let hasMesh = false
      base.traverse((c) => {
        if (c instanceof THREE.Mesh) {
          hasMesh = true
          c.castShadow = true
          c.receiveShadow = true
        }
      })
      const t = hasMesh ? base : ensureFallback()
      if (options?.rotateY) t.rotateY(options.rotateY)
      t.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(t)
      const size = new THREE.Vector3()
      box.getSize(size)
      const maxDimension = Math.max(size.x, size.y, size.z) || 1
      return { template: t, maxDimension, bottom: box.min.z }
    }

    const base = prepare(carScene)
    const second = prepare(carScene2, { rotateY: Math.PI })
    const truck = prepare(truckScene, { rotateY: Math.PI })

    const targetDim = tileSize * 0.9
    const scaleFor = (variant: { maxDimension: number }) => targetDim / Math.max(variant.maxDimension, 1)
    const baseScale = scaleFor(base)
    const car2Scale = scaleFor(second)
    const truckScale = scaleFor(truck)

    const createDirectionalOffsets = (
      overrides: Partial<Record<Direction, { 
        x: number 
        y: number 
      }>> = {}
    ) => ({
      east: { x: 0, y: 0 },
      west: { x: 0, y: 0 },
      north: { x: 0, y: 0 },
      south: { x: 0, y: 0 },
      ...overrides,
    })

    const smallShift = tileSize * 0.04

    return {
      car1: {
        type: "gltf" as const,
        template: base.template,
        scale: baseScale,
        offsetZ: 0,
        offsetByDir: createDirectionalOffsets({
          east: { x: smallShift - 15, y: 0 },
          west: { x: -smallShift + 15, y: 0 },
          north: { x: 0, y: smallShift - 15 },
          south: { x: 0, y: -smallShift + 15 },
        }),
      },
      car2: {
        type: "gltf" as const,
        template: second.template,
        scale: car2Scale,
        offsetZ: 0,
        offsetByDir: createDirectionalOffsets({
          east: { x: -smallShift + 5, y: 0 },
          west: { x: smallShift - 5, y: 0 },
          north: { x: 0, y: smallShift + 5 },
          south: { x: 0, y: -smallShift - 5 },
        }),
      },
      truck: {
        type: "gltf" as const,
        template: truck.template,
        scale: truckScale,
        offsetZ: 1,
        offsetByDir: createDirectionalOffsets({
          east: { x: -smallShift + 5, y: 0 },
          west: { x: smallShift - 5, y: 0 },
          north: { x: 0, y: smallShift + 5 },
          south: { x: 0, y: -smallShift - 5 },
        }),
      }
    } as const
  }, [carScene, carScene2, truckScene])

  const carId = useRef(0)
  const laneOffsetDistance = useMemo(() => tileSize * 0.15, [])
  const spawnBackOffset = useMemo(() => tileSize * 0.45, [])
  const planningBandMax = useMemo(() => tileSize * 0.9, [])
  const commitDistance = useMemo(() => tileSize * 0.42, [])
  const turningDuration = useMemo(() => 0.6, [])
  const intersectionStraightBias = useMemo(() => 0.7, [])
  const maxCars = 10

  const directionQuaternions = useMemo(() => {
    return {
      east: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, -Math.PI / 2, 0)),
      west: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, Math.PI / 2, 0)),
      north: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, Math.PI, -Math.PI)),
      south: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, -Math.PI, 0)),
    } as Record<Direction, THREE.Quaternion>
  }, [])

  const toStruct = (q: THREE.Quaternion): QuaternionStruct => ({ x: q.x, y: q.y, z: q.z, w: q.w })

  const turnRight = (d: Direction) => (d === "north" ? "east" : d === "east" ? "south" : d === "south" ? "west" : "north")
  const turnLeft = (d: Direction) => (d === "north" ? "west" : d === "west" ? "south" : d === "south" ? "east" : "north")

  const headingVec = (d: Direction) =>
    d === "east" ? new THREE.Vector2(1, 0) : d === "west" ? new THREE.Vector2(-1, 0) : d === "north" ? new THREE.Vector2(0, 1) : new THREE.Vector2(0, -1)

  const getLaneOffset = useMemo(
    () => (dir: Direction) => {
      switch (dir) {
        case "east":
          return { x: 0, y: -laneOffsetDistance * 2 }
        case "west":
          return { x: 0, y: laneOffsetDistance * 2 }
        case "north":
          return { x: laneOffsetDistance * 2, y: 0 }
        case "south":
        default:
          return { x: -laneOffsetDistance * 2, y: 0 }
      }
    },
    [laneOffsetDistance]
  )

  const carTypeToModel = (type: string): CarData["model"] | undefined => {
    if (type === "car1" || type === "car2" || type === "truck") return type
    return undefined
  }

  const { roadTiles, carMarkers } = useMemo(() => {
    const accept = new Set(["hor", "ver", "cross", "t-cross", "turn", "entry"])
    const roadList: RoadTile[] = []
    const markers: CarMarker[] = []

    rows.forEach((row, rowIndex) => {
      if (row.type !== "road") return
      row.roads.forEach((r: any) => {
        if (!r || typeof r.tileIndex !== "number") return
        const type: string = r.type
        const x = r.tileIndex * tileSize
        const y = (rowIndex - 10) * tileSize

        const markerDir = (r.dir as Direction | undefined) ?? (r.carDir as Direction | undefined) ?? undefined
        const preferredModel = (r.model as CarData["model"]) ?? (r.carModel as CarData["model"]) ?? carTypeToModel(type)
        const forwardOffset = typeof r.forward === "number" ? r.forward : typeof r.carForward === "number" ? r.carForward : undefined
        const presetSpeed = typeof r.speed === "number" ? r.speed : undefined

        if (CAR_MARKER_TYPES.has(type) || preferredModel) {
          const dir = markerDir ?? "east"
          markers.push({
            x,
            y,
            dir,
            model: preferredModel,
            forwardOffset,
            speed: presetSpeed,
          })

          const baseRoadType = (r.roadType as string) ?? (dir === "north" || dir === "south" ? "ver" : "hor")
          if (accept.has(baseRoadType)) {
            roadList.push({ x, y, type: baseRoadType })
          }
          return
        }

        if (accept.has(type)) {
          roadList.push({ x, y, type })
        }
      })
    })

    return { roadTiles: roadList, carMarkers: markers }
  }, [])

  const getRoadAt = (x: number, y: number): RoadTile | null => {
    let best: RoadTile | null = null
    let bestD2 = Infinity
    for (const t of roadTiles) {
      const dx = t.x - x
      const dy = t.y - y
      if (Math.abs(dx) < tileSize * 0.55 && Math.abs(dy) < tileSize * 0.55) {
        const d2 = dx * dx + dy * dy
        if (d2 < bestD2) {
          bestD2 = d2
          best = t
        }
      }
    }
    return best
  }

  const getNeighborPos = (x: number, y: number, dir: Direction) =>
    dir === "east" ? { x: x + tileSize, y } : dir === "west" ? { x: x - tileSize, y } : dir === "north" ? { x, y: y + tileSize } : { x, y: y - tileSize }

  const isDriveableInDir = (fromX: number, fromY: number, dir: Direction) => {
    const p = getNeighborPos(fromX, fromY, dir)
    const nxt = getRoadAt(p.x, p.y)
    if (!nxt) return false
    if (["cross", "t-cross", "turn", "entry"].includes(nxt.type)) return true
    if ((dir === "east" || dir === "west") && nxt.type === "hor") return true
    if ((dir === "north" || dir === "south") && nxt.type === "ver") return true
    return false
  }

  const entryPoints = useMemo(() => {
    const entries: { 
      x: number 
      y: number 
      dir: Direction 
    }[] = []
    for (const t of roadTiles) {
      if (t.type !== "entry") continue
      (["east", "west", "north", "south"] as Direction[]).forEach((d) => {
        if (isDriveableInDir(t.x, t.y, d)) entries.push({ x: t.x, y: t.y, dir: d })
      })
    }
    return entries
  }, [roadTiles])

  const createAppearance = (preferred?: CarData["model"]) => {
    let model = preferred ?? (Math.random() < 0.5 ? "car2" : "truck")
    let bodyColor: THREE.ColorRepresentation | undefined
    let cabinColor: THREE.ColorRepresentation | undefined
    if (model === "car1" || model === "car2") {
      const palette = SIMPLE_CAR_PALETTE[Math.floor(Math.random() * SIMPLE_CAR_PALETTE.length)]
      bodyColor = palette?.body ?? 0xff3333
      cabinColor = palette?.cabin ?? 0xffffff
    }
    return { model, bodyColor, cabinColor }
  }

  const createCarFromEntry = (entry: { 
    x: number 
    y: number 
    dir: Direction 
  }): CarData => {
    const laneOffset = getLaneOffset(entry.dir)
    const baseOrientation = directionQuaternions[entry.dir]
    let sx = entry.x + laneOffset.x
    let sy = entry.y + laneOffset.y
    if (entry.dir === "east") sx -= spawnBackOffset
    else if (entry.dir === "west") sx += spawnBackOffset
    else if (entry.dir === "north") sy -= spawnBackOffset
    else if (entry.dir === "south") sy += spawnBackOffset

    const appearance = createAppearance()

    return {
      id: carId.current++,
      x: sx,
      y: sy,
      dir: entry.dir,
      speed: 28 + Math.random() * 14,
      laneOffset,
      orientation: toStruct(baseOrientation),
      model: appearance.model,
      bodyColor: appearance.bodyColor,
      cabinColor: appearance.cabinColor,
      turnState: "idle",
      plannedDir: null,
      plannedTile: null,
      turningProgress: 0,
      skipTurnTile: null,
    }
  }

  const createCarFromMarker = (marker: CarMarker): CarData => {
    const { dir } = marker
    const laneOffset = getLaneOffset(dir)
    const baseOrientation = directionQuaternions[dir]
    let sx = marker.x + laneOffset.x
    let sy = marker.y + laneOffset.y

    const forward = marker.forwardOffset ?? (Math.random() - 0.5) * tileSize * 0.4
    if (forward) {
      const heading = headingVec(dir)
      sx += heading.x * forward
      sy += heading.y * forward
    }

    const appearance = createAppearance(marker.model)
    const speed = marker.speed ?? 28 + Math.random() * 14

    return {
      id: carId.current++,
      x: sx,
      y: sy,
      dir,
      speed,
      laneOffset,
      orientation: toStruct(baseOrientation),
      model: appearance.model,
      bodyColor: appearance.bodyColor,
      cabinColor: appearance.cabinColor,
      turnState: "idle",
      plannedDir: null,
      plannedTile: null,
      turningProgress: 0,
      skipTurnTile: null,
    }
  }

  const [cars, setCars] = useState<CarData[]>(() => {
    if (entryPoints.length === 0 && carMarkers.length === 0) return []

    const markerCars = carMarkers.slice(0, maxCars).map((marker) => createCarFromMarker(marker))

    const remainingCapacity = Math.max(0, Math.min(4, entryPoints.length, maxCars - markerCars.length))
    const entryCars = Array.from({ length: remainingCapacity }).map(() => {
      const e = entryPoints[Math.floor(Math.random() * entryPoints.length)]
      return createCarFromEntry(e)
    })

    return [...markerCars, ...entryCars]
  })

  const carRefs = useRef<Record<number, THREE.Group>>({})
  const spawnTimer = useRef(0)

  useFrame((_, delta) => {
    if (!isActive) {
      return
    }

    let workingCars: CarData[] = cars

    spawnTimer.current += delta
    if (spawnTimer.current > 2 && entryPoints.length > 0 && workingCars.length < maxCars) {
      spawnTimer.current = 0
      const e = entryPoints[Math.floor(Math.random() * entryPoints.length)]
      workingCars = [...workingCars, createCarFromEntry({ x: e.x, y: e.y, dir: e.dir })]
    }

    const nextCars = workingCars
      .map((c) => {
        let { x, y, dir, laneOffset, speed } = c
        let { turnState, plannedDir, plannedTile, turningProgress } = c
        let { turnStartX, turnStartY, skipTurnTile } = c

        const xPrev = x
        const yPrev = y

        const prevTile = getRoadAt(xPrev, yPrev)

        if (prevTile) {
          const aheadPos = getNeighborPos(prevTile.x, prevTile.y, dir)
          const aheadTile = getRoadAt(aheadPos.x, aheadPos.y)
          const isIntersection = !!aheadTile && ["turn", "cross", "t-cross"].includes(aheadTile.type)

          if (turnState === "idle" && isIntersection) {
            const straightOK = isDriveableInDir(aheadTile!.x, aheadTile!.y, dir)
            const rightDir = turnRight(dir)
            const leftDir = turnLeft(dir)
            const rightOK = isDriveableInDir(aheadTile!.x, aheadTile!.y, rightDir)
            const leftOK = isDriveableInDir(aheadTile!.x, aheadTile!.y, leftDir)
            const skipAhead = skipTurnTile && aheadTile && skipTurnTile.x === aheadTile.x && skipTurnTile.y === aheadTile.y

            const lateralOpts: Direction[] = []
            if (rightOK) lateralOpts.push(rightDir)
            if (leftOK) lateralOpts.push(leftDir)

            let chosen: Direction | null = null

            if (aheadTile!.type === "turn") {
              if (lateralOpts.length > 0) chosen = lateralOpts[Math.floor(Math.random() * lateralOpts.length)]
            } else if (!straightOK) {
              if (lateralOpts.length > 0) chosen = lateralOpts[Math.floor(Math.random() * lateralOpts.length)]
            } else if (!skipAhead && lateralOpts.length > 0) {
              chosen = Math.random() < intersectionStraightBias ? null : lateralOpts[Math.floor(Math.random() * lateralOpts.length)]
            }

            if (chosen && chosen !== dir) {
              plannedDir = chosen
              plannedTile = { x: aheadTile!.x, y: aheadTile!.y }
              turnState = "planned"
              skipTurnTile = null
            } else {
              plannedDir = null
              plannedTile = { x: aheadTile!.x, y: aheadTile!.y }
              turnState = "idle"
              if (straightOK) skipTurnTile = { x: aheadTile!.x, y: aheadTile!.y }
            }
          }

          if (turnState === "planned" && plannedDir && plannedTile) {
            const distNow = Math.hypot(plannedTile.x - x, plannedTile.y - y)
            if (distNow <= commitDistance) {
              turnState = "turning"
              turningProgress = 0
              turnStartX = x
              turnStartY = y
              skipTurnTile = null
            }
          }
        }

        if (turnState === "turning" && plannedDir && plannedTile) {
          turningProgress = Math.min(1, (turningProgress ?? 0) + delta / turningDuration)

          const fromQuat = directionQuaternions[dir]
          const toQuat = directionQuaternions[plannedDir]
          const blended = new THREE.Quaternion().copy(fromQuat).slerp(toQuat, turningProgress)
          c.orientation = toStruct(blended)

          const startOffset = new THREE.Vector2(turnStartX!, turnStartY!)
          const newLaneOffset = getLaneOffset(plannedDir)
          const endOffset = new THREE.Vector2(plannedTile.x + newLaneOffset.x, plannedTile.y + newLaneOffset.y)

          const interp = new THREE.Vector2().copy(startOffset).lerp(endOffset, turningProgress)
          const headingVecNew = headingVec(plannedDir)
          const forwardPush = headingVecNew.clone().multiplyScalar(tileSize * 0.25 * turningProgress)

          x = interp.x + forwardPush.x
          y = interp.y + forwardPush.y
          laneOffset = { x: newLaneOffset.x, y: newLaneOffset.y }

          if (turningProgress >= 1) {
            dir = plannedDir
            plannedDir = null
            plannedTile = null
            turnState = "idle"
            turningProgress = 0
            turnStartX = undefined
            turnStartY = undefined
            skipTurnTile = null
          }
        } else {
          const moveFactor =
            turnState === "planned" && plannedDir && plannedTile
              ? 0.50 + 0.65 * THREE.MathUtils.clamp((Math.hypot(plannedTile.x - x, plannedTile.y - y) - commitDistance) / (planningBandMax - commitDistance + 0.0001), 0, 1)
              : 1
          const d = speed * delta * moveFactor
          if (dir === "east") x += d
          else if (dir === "west") x -= d
          else if (dir === "north") y += d
          else y -= d
        }

        if (prevTile && (!plannedDir || turnState === "idle")) {
          let crossed = false
          if (dir === "east") crossed = xPrev <= prevTile.x && x >= prevTile.x
          else if (dir === "west") crossed = xPrev >= prevTile.x && x <= prevTile.x
          else if (dir === "north") crossed = yPrev <= prevTile.y && y >= prevTile.y
          else if (dir === "south") crossed = yPrev >= prevTile.y && y <= prevTile.y

          if (crossed) {
            if (dir === "east" || dir === "west") y = prevTile.y + laneOffset.y
            else x = prevTile.x + laneOffset.x
          }
        }
        const tileNow = getRoadAt(x, y)
        if (!tileNow) {
          return null
        }
        if (tileNow.type === "entry") {
          const heading = headingVec(dir)
          const deltaToCenter = new THREE.Vector2(x - tileNow.x, y - tileNow.y)
          if (!isDriveableInDir(tileNow.x, tileNow.y, dir) && deltaToCenter.dot(heading) > tileSize * 0.35) return null
        }
        if (Math.abs(x) > tileSize * 20 || Math.abs(y) > tileSize * 20) return null

        return {
          ...c,
          x,
          y,
          dir,
          laneOffset,
          speed,
          turnState,
          plannedDir: plannedDir ?? null,
          plannedTile: plannedTile ?? null,
          turningProgress: turningProgress ?? 0,
          orientation: c.orientation,
          turnStartX,
          turnStartY,
          skipTurnTile,
        } as CarData
      })
      .filter((c): c is CarData => c !== null)

    setCars(nextCars)

    for (const car of nextCars) {
      const ref = carRefs.current[car.id]
      if (!ref) continue
      const q = car.orientation
      ref.quaternion.set(q.x, q.y, q.z, q.w)
      const variant = carVariants[car.model]
      const offsets = variant.offsetByDir
      const currentOffset = offsets?.[car.dir] ?? { x: 0, y: 0 }
      let offsetX = currentOffset.x
      let offsetY = currentOffset.y

      if (car.turnState === "turning" && car.plannedDir) {
        const targetOffset = offsets?.[car.plannedDir] ?? { x: 0, y: 0 }
        const t = THREE.MathUtils.clamp(car.turningProgress ?? 0, 0, 1)
        offsetX = THREE.MathUtils.lerp(currentOffset.x, targetOffset.x, t)
        offsetY = THREE.MathUtils.lerp(currentOffset.y, targetOffset.y, t)
      }

      ref.position.set(car.x + offsetX, car.y + offsetY, variant.offsetZ)
    }
  })

  return (
    <group>
      {cars.map((car) => {
        const variant = carVariants[car.model]
        return (
          <group
            key={car.id}
            ref={(el) => {
              if (el) carRefs.current[car.id] = el
            }}
            position={[car.x, car.y, variant.offsetZ]}
            scale={[variant.scale, variant.scale, variant.scale]}
          >
            {variant.type === "gltf" ? <primitive object={variant.template.clone(true)} /> : <group rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0, -6]} />}
          </group>
        )
      })}
    </group>
  )
}

useGLTF.preload("/models/Car.glb")
useGLTF.preload("/models/cutruck.glb")
