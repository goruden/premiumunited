import { createContext, useContext, useEffect, useState } from "react"

export type MapThemeContextValue = {
  isDark: boolean
}

const defaultValue: MapThemeContextValue = { isDark: false }

const MapThemeContext = createContext<MapThemeContextValue>(defaultValue)

type ProviderProps = {
  children: React.ReactNode
  initialIsDark?: boolean
  observeDocumentDarkClass?: boolean
}

export const MapThemeProvider = ({
  children,
  initialIsDark = false,
  observeDocumentDarkClass = false,
}: ProviderProps) => {
  const [isDark, setIsDark] = useState(() => {
    if (observeDocumentDarkClass && typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark")
    }
    return initialIsDark
  })

  useEffect(() => {
    if (!observeDocumentDarkClass || typeof document === "undefined") {
      return
    }

    const htmlEl = document.documentElement
    const compute = () => htmlEl.classList.contains("dark")
    const observer = new MutationObserver(() => setIsDark(compute()))

    observer.observe(htmlEl, { attributes: true, attributeFilter: ["class"] })
    setIsDark(compute())

    return () => observer.disconnect()
  }, [observeDocumentDarkClass])

  return (
    <MapThemeContext.Provider value={{ isDark }}>
      {children}
    </MapThemeContext.Provider>
  )
}

export const useMapTheme = () => useContext(MapThemeContext)
