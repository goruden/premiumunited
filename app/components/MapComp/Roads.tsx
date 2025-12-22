import { useGLTF } from "@react-three/drei"
import { tileSize } from "./MapData/constants"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import type { RoadTile } from "./MapData/types"
import { useMapTheme } from "./MapThemeContext"
import React from "react"

type Props = RoadTile

export function Roads({ tileIndex, type, rotation, offset, scale }: Props) {
  const { scene: building1 } = useGLTF("/models/Building.glb")
  const { scene: building2 } = useGLTF("/models/Building-2.glb")
  const { scene: small_building } = useGLTF("/models/Small-Building.glb")
  const { scene: large_building } = useGLTF("/models/Large-Building-3.glb")
  const { scene: low_building } = useGLTF("/models/Low-Building.glb")
  const { scene: low_building2 } = useGLTF("/models/Low-Building-2.glb")
  const { scene: low_wide } = useGLTF("/models/Low-Wide.glb")
  const { scene: skyscraper } = useGLTF("/models/Skyscraper.glb")
  const { scene: skyscraper2 } = useGLTF("/models/Skyscraper-2.glb")
  const { scene: path } = useGLTF("/models/Path.glb")
  const { scene: horse } = useGLTF("/models/Horse.glb")
  const { scene: hedge } = useGLTF("/models/Hedge.glb")
  const { scene: tree } = useGLTF("/models/Tree.glb")
  const { scene: tree2 } = useGLTF("/models/Tree-2.glb")
  const { scene: statue } = useGLTF("/models/Statue.glb")
  const { scene: pedestal } = useGLTF("/models/Pedestal.glb")
  const { scene: fountain } = useGLTF("/models/Fountain.glb")
  const { scene: statue_sitting } = useGLTF("/models/Statue-sitting.glb")
  const { scene: statue_2 } = useGLTF("/models/Statue-2.glb")
  const { scene: pillar } = useGLTF("/models/Pillar.glb")
  const { scene: cu } = useGLTF("/models/Cu.glb")
  const { scene: cu_logo } = useGLTF("/models/cu_logo.glb")
  const { scene: street_light } = useGLTF("/models/Streetlight.glb")
  const models = [building1, building2, small_building, large_building, low_building, low_building2, low_wide, skyscraper, skyscraper2, path, horse, hedge, tree, tree2, statue, pedestal, fountain, statue_sitting, statue_2, pillar, cu, cu_logo, street_light]
  models.forEach((scene) =>
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  )

  const carRef = useRef<THREE.Group>(null)
  const [angle, setAngle] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const { isDark } = useMapTheme()

  useFrame((_, delta) => {
    if (!carRef.current) return
    const speed = 2

    if (type === "hor") {
      carRef.current.position.x += dir * speed * delta * 5
      if (carRef.current.position.x > tileSize / 2) setDir(-1)
      if (carRef.current.position.x < -tileSize / 2) setDir(1)
    } else if (type === "ver") {
      carRef.current.position.y += dir * speed * delta * 5
      if (carRef.current.position.y > tileSize / 2) setDir(-1)
      if (carRef.current.position.y < -tileSize / 2) setDir(1)
    } else if (type === "cross") {
      const r = tileSize / 3
      const turnSpeed = 0.5
      const newAngle = angle + turnSpeed * delta * dir
      carRef.current.position.x = Math.cos(newAngle) * r
      carRef.current.position.y = Math.sin(newAngle) * r
      carRef.current.rotation.z = -newAngle - Math.PI / 2
      setAngle(newAngle)
    }
  })

  let mesh: React.ReactElement | null = null

  switch (type) {
    case "street_light":
      mesh = (
        <group>
          <primitive
            object={street_light.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize, tileSize, tileSize]}
          />
          {isDark ? (
            <pointLight
              position={ [10, 0, tileSize - 3]}
              intensity={50}
              distance={tileSize * 6}
              decay={1.2}
              color="#ffd27f"
              castShadow
            />
          ) : null}
        </group>
      )
      break
    case "hor":
      mesh = (
        <group>
          <mesh position-z={1}>
            <boxGeometry args={[tileSize, tileSize, 3]} />
            <meshLambertMaterial color={0x4d2926} />
          </mesh>
          <mesh position-z={1.1}>
            <boxGeometry args={[tileSize / 2, tileSize / 10, 4]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
        </group>
      )
      break
    case "car1":
    case "car2":
    case "truck":
      mesh = (
        <group>
        </group>
      )
      break

    case "ver":
      mesh = (
        <group>
          <mesh position-z={1}>
            <boxGeometry args={[tileSize, tileSize, 3]} />
            <meshLambertMaterial color={0x4d2926} />
          </mesh>
          <mesh position-z={1.1}>
            <boxGeometry args={[tileSize / 10, tileSize / 2, 4]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
        </group>
      )
      break

    case "cross":
      mesh = (
        <group>
          <mesh position-z={1}>
            <boxGeometry args={[tileSize, tileSize, 3]} />
            <meshLambertMaterial color={0x4d2926} />
          </mesh>
          <mesh position-z={1.1}>
            <boxGeometry args={[tileSize / 2, tileSize / 10, 4]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
          <mesh position-z={1.1}>
            <boxGeometry args={[tileSize / 10, tileSize / 2, 4]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
        </group>
      )
      break
    
    case "turn":
      mesh = (
        <group>
          <mesh position-z={1}>
            <boxGeometry args={[tileSize, tileSize, 3]} />
            <meshLambertMaterial color={0x4d2926} />
          </mesh>
        </group>
      )
      break
    
    case "t-cross":
      mesh = (
        <group>
          <mesh position-z={1}>
            <boxGeometry args={[tileSize, tileSize, 3]} />
            <meshLambertMaterial color={0x4d2926} />
          </mesh>
          <mesh position-z={1.1}>
            <boxGeometry args={[tileSize / 10, tileSize / 10, 4]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
          <mesh position-z={1.1}>
            <boxGeometry args={[tileSize / 10, tileSize / 10, 4]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
        </group>
      )
      break
    
    case "entry":
      mesh = (
        <group>
          <mesh position-z={1}>
            <boxGeometry args={[tileSize, tileSize, 3]} />
            <meshLambertMaterial color={0x4d2926} />
          </mesh>
          <mesh position-z={1.1}>
            <boxGeometry args={[tileSize / 2, tileSize / 2, 4]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
        </group>
      )
      break

    case "building1":
      mesh = (
        <group>
          <primitive
            object={building1.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize, tileSize, tileSize]}
          />
        </group>
      )
      break

    case "building2":
      mesh = (
        <group>
          <primitive
            object={building2.clone()}
            position={[tileSize / 2, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize, tileSize, tileSize - 7]}
          />
        </group>
      )
      break

    case "small_building":
      mesh = (
        <group>
          <primitive
            object={small_building.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize, tileSize, tileSize]}
          />
        </group>
      )
      break
      
    case "large_building":
      mesh = (
        <group>
          <primitive
            object={large_building.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize - 6, tileSize , tileSize - 6]}
          />
        </group>
      )
      break
    case "low_building":
      mesh = (
        <group>
          <primitive
            object={low_building.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize * 2, tileSize * 2, tileSize * 2]}
          />
        </group>
      )
      break
    case "low_building2":
      mesh = (
        <group>
          <primitive
            object={low_building2.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize * 2, tileSize * 2, tileSize * 2]}
          />
        </group>
      )
      break
    case "low_wide":
      mesh = (
        <group>
          <primitive
            object={low_wide.clone()}
            position={[tileSize / 2, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize * 2, tileSize * 2, tileSize * 2]}
          />
        </group>
      )
      break
    case "skyscraper":
      mesh = (
        <group>
          <primitive
            object={skyscraper.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize - 8, tileSize, tileSize - 8]}
          />
        </group>
      )
      break
    case "cu":
      mesh = (
        <group>
          <primitive
            object={cu.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize - 8, tileSize, tileSize - 8]}
          />
        </group>
      )
      break
    case "skyscraper2":
      mesh = (
        <group>
          <primitive
            object={skyscraper2.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize - 8, tileSize, tileSize - 8]}
          />
        </group>
      )
      break
    case "hedge":
      mesh = (
        <group>
          <primitive
            object={hedge.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize, tileSize, tileSize]}
          />
        </group>
      )
      break
    case "tree":
      mesh = (
        <group>
          <primitive
            object={tree.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize, tileSize, tileSize]}
          />
        </group>
      )
      break
    case "tree2":
      mesh = (
        <group>
          <primitive
            object={tree2.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, Math.PI, 0]}
            scale={[tileSize, tileSize, tileSize]}
          />
        </group>
      )
      break
    case "path":
      mesh = (
        <group>
          <primitive
            object={path.clone()}
            position={[-11, 0, 1]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
            scale={[tileSize / 2, tileSize, tileSize / 2]}
          />
          <primitive
            object={path.clone()}
            position={[tileSize / 2 - 11, 0, 1]}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
            scale={[tileSize / 2, tileSize, tileSize / 2]}
          />
        </group>
      )
      break
    case "horse":
      mesh = (
        <group>
          <group>
            <primitive
              object={horse.clone()}
              position={[-tileSize - 5, 0, 1]}
              rotation={[Math.PI / 2, Math.PI / 2, 0]}
              scale={[tileSize / 5, tileSize / 5, tileSize / 5]}
            />
          </group>
        </group>
      )
      break
    case "statue":
      mesh = (
        <group>
          <primitive
            object={statue.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, -Math.PI / 2, 0]}
            scale={[tileSize / 2, tileSize / 2, tileSize / 2]}
          />
        </group>
      )
      break
    case "pedestal":
      mesh = (
        <group>
          <primitive
            object={pedestal.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, -Math.PI / 2, 0]}
            scale={[tileSize / 2, tileSize / 2, tileSize / 2]}
          />
        </group>
      )
      break
    case "fountain":
      mesh = (
        <group>
          <primitive
            object={fountain.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, -Math.PI / 2, 0]}
            scale={[tileSize / 2, tileSize / 2, tileSize / 2]}
          />
        </group>
      )
      break
    case "statue_sitting":
      mesh = (
        <group>
          <primitive
            object={statue_sitting.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, -Math.PI / 2, 0]}
            scale={[tileSize / 2, tileSize / 2, tileSize / 2]}
          />
        </group>
      )
      break
    case "statue_2":
      mesh = (
        <group>
          <primitive
            object={statue_2.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, -Math.PI / 2, 0]}
            scale={[tileSize / 2, tileSize / 2, tileSize / 2]}
          />
        </group>
      )
      break
    case "pillar":
      mesh = (
        <group>
          <primitive
            object={pillar.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, -Math.PI / 2, 0]}
            scale={[tileSize / 2, tileSize / 2, tileSize / 2]}
          />
        </group>
      )
      break
    case "base":
      mesh = (
        <group>
          <mesh position={[0, 0, 1]}>
            <boxGeometry args={[tileSize, tileSize, 4]} />
            <meshLambertMaterial color="#C4C4C4" />
          </mesh>
        </group>
      )
      break
    case "cu_logo":
      mesh = (
        <group>
          <primitive
            object={cu_logo.clone()}
            position={[0, 0, 1]}
            rotation={[Math.PI / 2, -Math.PI / 2, 0]}
            scale={[tileSize / 2, tileSize / 2, tileSize / 2]}
            
          />
        </group>
      )
      break
    default:
      mesh = (
        <mesh position={[0, 0, 1]}>
          <boxGeometry args={[tileSize, tileSize, 4]} />
          <meshLambertMaterial color="#dedede" />
        </mesh>
      )
  }

  const [offsetX = 0, offsetY = 0, offsetZ = 0] = offset ?? [0, 0, 0]
  const [rotationX = 0, rotationY = 0, rotationZ = 0] = rotation ?? [0, 0, 0]
  const resolvedScale = scale ?? [1, 1, 1]

  return (
    <group
      position={[tileIndex * tileSize + offsetX, offsetY, offsetZ]}
      rotation={[rotationX, rotationY, rotationZ] as [number, number, number]}
      scale={resolvedScale}
    >
      {mesh}
    </group>
  )
}

useGLTF.preload("/models/Building.glb")
useGLTF.preload("/models/Building-2.glb")
useGLTF.preload("/models/Small_Building.glb")
useGLTF.preload("/models/Low_Building.glb")
useGLTF.preload("/models/Low_Building2.glb")
useGLTF.preload("/models/Low_Wide.glb")
useGLTF.preload("/models/Skyscraper.glb")
useGLTF.preload("/models/Skyscraper2.glb")
useGLTF.preload("/models/Path.glb")
useGLTF.preload("/models/Tree.glb")
useGLTF.preload("/models/Tree2.glb")
useGLTF.preload("/models/Statue.glb")
useGLTF.preload("/models/Pedestal.glb")
useGLTF.preload("/models/Fountain.glb")
useGLTF.preload("/models/Statue-sitting.glb")
useGLTF.preload("/models/Statue-2.glb")
useGLTF.preload("/models/Pillar.glb")
useGLTF.preload("/models/Cu.glb")
useGLTF.preload("/models/cu_logo.glb")