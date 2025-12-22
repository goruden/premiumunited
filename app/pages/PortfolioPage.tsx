import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import ImageSlider from "../components/ImageSlider"

const images = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "6.jpg",
    "7.jpg",
    "8.jpg",
    "9.jpg",
    "10.jpg",
    "11.jpg",
    "12.jpg",
    "13.jpg",
    "14.jpg",
    "15.jpg",
    "16.jpg",
    "17.jpg",
    "18.jpg",
    "19.jpg",
    "20.jpg",
    "21.jpg",
    "22.jpg",
    "23.jpg"
]

const PortfolioPage = () => {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    const xVariants = {
        hidden: { opacity: 0, x: 20 },
        show: { opacity: 1, x: 0 }
    }

    const { t } = useTranslation()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)

    // NEW: Disable slider animation when closing modal
    const [disableSliderAnim, setDisableSliderAnim] = useState(false)

    const openModal = useCallback((index: number) => {
        setDisableSliderAnim(false) // enable animations
        setSelectedIndex(index)
        setIsModalOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setDisableSliderAnim(true) // disable animations BEFORE closing -> fixes lag
        setIsModalOpen(false)
    }, [])

    useEffect(() => {
        if (!isModalOpen) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeModal()
        }

        document.body.style.overflow = "hidden"
        document.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.style.overflow = ""
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isModalOpen, closeModal])
    const containerRef = useRef<HTMLDivElement | null>(null)

    return (
        <LayoutGroup>
            <section
                id="portfolio"
                className="bg-[#F2F2F2] dark:bg-[#121113] transition-colors duration-500"
                ref={containerRef}
            >
                <div className="max-w-6xl mx-auto py-20 md:py-20 lg:py-30 px-10 text-center">
                    <p className="mb-3 text-xs text-red-600">{t("PortfolioPage.sub_title")}</p>
                    <p className="mb-5 text-2xl md:text-3xl font-semibold">{t("PortfolioPage.title")}</p>
                    <p className="mb-5 text-neutral-700 dark:text-neutral-200">{t("PortfolioPage.description")}</p>

                    {/* Masonry Grid */}
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
                        {images.map((img, idx) => (
                            <motion.div
                                key={idx}
                                variants={variants}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.1 }}
                                className="overflow-hidden break-inside-avoid hover:ring-1 hover:ring-red-500 rounded-lg cursor-pointer"
                                onClick={() => openModal(idx)}
                                role="button"
                                tabIndex={0}
                                aria-label={`Open image ${idx + 1}`}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        openModal(idx)
                                    }
                                }}
                            >
                                <motion.img
                                    src={img}
                                    loading="lazy"
                                    draggable={false}
                                    alt={`Portfolio ${idx + 1}`}
                                    className="w-full h-auto rounded-lg object-contain transition-transform duration-300 hover:scale-105 dark:brightness-90"
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* MODAL */}
                    <AnimatePresence>
                        {isModalOpen && (
                            <motion.div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                onClick={closeModal}
                                aria-modal="true"
                                role="dialog"
                            >
                                <motion.div
                                    className="relative w-full h-auto max-w-md md:max-w-lg lg:max-w-xl px-4 justify-items-center"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ type: "tween", duration: 0.05 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ImageSlider
                                        imageUrls={images}
                                        initialIndex={selectedIndex}
                                        autoPlay={false}
                                        contain
                                        disableAnimation={disableSliderAnim}
                                    />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </LayoutGroup>
    )
}

export default PortfolioPage
