import { useEffect, useRef, useState } from "react"
import { Scene } from "../../components/MapComp/Scene"
import { Map } from "../../components/MapComp/Map"

const CityMap = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const lastIntersectionState = useRef(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      setIsActive(true)
      return
    }

    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry?.isIntersecting ?? false
        lastIntersectionState.current = inView
        setIsActive(inView && !document.hidden)
      },
      {
        threshold: 0.2,
      }
    )

    observer.observe(node)

    const handleVisibilityChange = () => {
      setIsActive(lastIntersectionState.current && !document.hidden)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className="mx-auto max-w-6xl h-150 md:h-180 py-10 md:py-20 lg:py-30 px-10">
        <Scene isActive={isActive}>
          <Map />
        </Scene>
      </div>
    </div>
  )
}

export default CityMap