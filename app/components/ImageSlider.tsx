import React from 'react'

export type ImageSliderProps = {
  imageUrls: string[]
  initialIndex?: number
  autoPlay?: boolean
  autoPlayInterval?: number
  contain?: boolean
  disableAnimation?: boolean
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  imageUrls,
  initialIndex = 0,
  autoPlay = true,
  autoPlayInterval = 5000,
  contain = false,
  disableAnimation = false,
}) => {
  const total = imageUrls.length
  const clampIndex = React.useCallback(
    (idx: number) => {
      if (!total) return 0
      if (idx < 0) return total - 1
      if (idx >= total) return 0
      return idx
    },
    [total]
  )

  const [imageIndex, setImageIndex] = React.useState(() => clampIndex(initialIndex))
  
  React.useEffect(() => {
    setImageIndex(clampIndex(initialIndex))
  }, [initialIndex, clampIndex])

  React.useEffect(() => {
    if (!total || !autoPlay || total <= 1) return undefined

    const timer = setInterval(() => {
      setImageIndex((idx) => (idx === total - 1 ? 0 : idx + 1))
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [total, autoPlay, autoPlayInterval])

  const prevImage = () => {
    if (!total) return
    setImageIndex((idx) => clampIndex(idx - 1))
  }

  const nextImage = () => {
    if (!total) return
    setImageIndex((idx) => clampIndex(idx + 1))
  }

  return (
    <div className="relative w-full max-w-xl rounded-xl overflow-hidden flex items-center justify-center">
      <div
        className={`flex w-full ${contain ? 'h-auto items-center' : 'h-64 md:h-80 lg:h-96'} ${
          disableAnimation ? '' : 'transition-transform duration-500 ease-in-out'
        }`}
        style={{ transform: `translateX(-${imageIndex * 100}%)` }}
      >
        {imageUrls.map((url, idx) => (
          <img
            key={url + idx}
            src={url}
            alt={`Slide ${idx + 1}`}
            draggable={false}
            className={`w-full ${contain ? 'h-auto object-contain' : 'h-full object-cover'} shrink-0`}
            loading="lazy"
          />
        ))}
      </div>
      {/* Left Arrow */}
      <button
        aria-label="Previous image"
        onClick={prevImage}
        className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/50 text-white rounded-full p-2 z-10 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        ←
      </button>
      {/* Right Arrow */}
      <button
        aria-label="Next image"
        onClick={nextImage}
        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/50 text-white rounded-full p-2 z-10 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        →
      </button>
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {imageUrls.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to image ${idx + 1}`}
            className={`cursor-pointer w-3 h-3 rounded-full ${idx === imageIndex ? 'bg-red-500' : 'bg-gray-300'} border-2 border-white shadow`}
            onClick={() => setImageIndex(idx)}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageSlider