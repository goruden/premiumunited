import { useEffect, useMemo, useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { Traffic } from "./Traffic"
import { useMapTheme } from "./MapThemeContext"
import { OrbitControls } from "@react-three/drei"

type SceneProps = {
  children: React.ReactNode
  isActive?: boolean
}

type ResponsiveCameraProps = {
  zoom: number
  position: [number, number, number]
}

const ResponsiveCamera = ({ zoom, position }: ResponsiveCameraProps) => {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(...position)
    if ("zoom" in camera) {
      camera.zoom = zoom
      camera.updateProjectionMatrix()
    }
  }, [camera, position, zoom])

  return null
}

export const Scene = ({ children, isActive = true }: SceneProps) => {
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { isDark } = useMapTheme()

  const cameraPosition = useMemo(
    () => [250, -1000, 650] as [number, number, number],
    []
  )

  const sceneTheme = useMemo(
    () =>
      isDark
        ? {
            ambient: { intensity: 10, color: 0x223344 },
            directional: {
              intensity: 1.1,
              color: 0xffddaa,
              position: [-120, -80, 220] as [number, number, number],
            },
          }
        : {
            ambient: { intensity: 0.9, color: 0xffffff },
            directional: {
              intensity: 0.9,
              color: 0xffffff,
              position: [-200, -200, 300] as [number, number, number],
            },
          },
    [isDark]
  )

  // Auto zoom based on window width
  useEffect(() => {
    const computeZoom = (width: number) => {
      if (width < 641) return 1.1
      if (width < 1025) return 1.4
      if (width < 1441) return 1.5
      return 1.7
    }

    let timeoutId: number
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => setZoom(computeZoom(window.innerWidth)), 100)
    }

    handleResize()
    window.addEventListener("resize", handleResize, { passive: true })
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  return (
    <div
      className={"bg-gray-50 dark:bg-gray-800"}
      style={{
        position: isFullscreen ? "fixed" : "relative",
        inset: isFullscreen ? 0 : undefined,
        width: isFullscreen ? "100vw" : "100%",
        height: isFullscreen ? "100vh" : "500px", // normal size
        zIndex: isFullscreen ? 9999 : "auto",
        transition: "all 0.3s ease",
      }}
    >
      <Canvas
        orthographic
        camera={{
          up: [0, 0, 1],
          position: cameraPosition,
          zoom,
          near: 0.1,
          far: 4000,
        }}
      >
        <ResponsiveCamera zoom={zoom} position={cameraPosition} />

        <ambientLight
          intensity={sceneTheme.ambient.intensity}
          color={sceneTheme.ambient.color}
        />
        <directionalLight
          position={sceneTheme.directional.position}
          intensity={sceneTheme.directional.intensity}
          color={sceneTheme.directional.color}
        />
        {children}
        <Traffic isActive={isActive} />
        <OrbitControls enabled={isFullscreen} />
      </Canvas>

      <button
        onClick={toggleFullscreen}
        className="absolute top-5 right-5 p-3 bg-white border border-gray-200 rounded-md cursor-pointer z-30"
      >
        {isFullscreen 
          ? <svg xmlns="http://www.w3.org/2000/svg" color="black" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
            </svg>
          : <svg xmlns="http://www.w3.org/2000/svg" color="black" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
        }
      </button>
    </div>
  )
}
