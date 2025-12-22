import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"

export default function Timeline() {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    const xVariants = {
        hidden: { opacity: 0, x: 20 },
        show: { opacity: 1, x: 0 }
    }

    const { t } = useTranslation()
    const eventsRaw = t('timeline', { returnObjects: true })
    const events = Array.isArray(eventsRaw) ? eventsRaw : []

    const [activeIndex, setActiveIndex] = useState<number>(0)
    const activeEvent = events[activeIndex]

    useEffect(() => {
        localStorage.setItem("timelineActiveIndex", activeIndex.toString())
    }, [activeIndex])

    return (
        <div className="w-full">
            <div className="max-w-6xl mx-auto py-10 px-5 md:px-10">
                <motion.div
                    variants={variants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.2 }}
                    className="flex flex-col items-center pb-10"
                >
                    <p className="text-2xl md:text-3xl font-semibold">{t("TimelinePage.title")}</p>
                    <div className="flex gap-8 px-6 pb-6 overflow-x-auto">
                        {events.map((event, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center min-w-[50px] md:min-w-[150px] mt-10 cursor-pointer relative"
                                onClick={() => setActiveIndex(index)}
                            >
                                <motion.div
                                    animate={{
                                        scale: index === activeIndex ? 1.5 : 1,
                                        backgroundColor: index === activeIndex ? "#ef4444" : "#9ca3af",
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="w-5 h-5 rounded-full mb-2"
                                />
                                <div
                                    className={`text-center font-medium 
                                ${index === activeIndex ? "text-red-600" : ''}`}
                                >
                                    <div>{event.date}</div>
                                    <div className="">{event.title}</div>
                                </div>
                                {index !== events.length - 1 && (
                                    <div className="absolute top-2 left-[calc(100%)] h-1 bg-gray-300 w-8 " />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 w-[90%] md:w-[60%] text-center">
                        <AnimatePresence mode="wait">
                            {activeEvent && (
                                <motion.div
                                    key={activeIndex}
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    transition={{ duration: 0.3 }}
                                    className="p-6 bg-white dark:bg-[#222222] rounded-2xl shadow-md transition-colors duration-500"
                                >
                                    <h3 className="text-lg md:text-xl font-semibold mb-3">
                                        {activeEvent.title}
                                    </h3>
                                    <p className="text-neutral-700 dark:text-neutral-200">
                                        {activeEvent.line}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
