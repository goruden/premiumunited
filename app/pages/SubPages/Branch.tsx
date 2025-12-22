import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"

const Branch = () => {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    const xVariants = {
        hidden: { opacity: 0, x: 20 },
        show: { opacity: 1, x: 0 }
    }

    const { t } = useTranslation()
    const eventsRaw = t("branch", { returnObjects: true })
    const events = Array.isArray(eventsRaw) ? eventsRaw : []
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const activeEvent = events[activeIndex]
    useEffect(() => {
        localStorage.setItem("activeIndex", activeIndex.toString())
    }, [activeIndex])

    return (
        <div className="max-w-6xl mx-auto justify-items-center">
            <div className="py-10 md:py-20 lg:py-30 px-10 text-center">
                <p className="pb-3 text-red-600 text-xs">{t("BranchPage.sub_title")}</p>
                <p className="pb-5 font-semibold text-2xl md:text-3xl">{t("BranchPage.title")}</p>
                <p className="pb-5 text-neutral-700 dark:text-neutral-200">{t("BranchPage.line1")}</p>
                <div className="flex flex-col md:flex-row  gap-6 items-center">
                    <div className="flex-1 grid grid-cols-3 lg:grid-cols-4 pt-5 md:pt-10 gap-6 flex-wrap justify-center md:justify-start">
                        {events.map((event, index) => (
                            <motion.div
                                variants={variants}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: false, amount: 0.2 }}
                                key={index}
                                className="flex flex-col items-center cursor-pointer relative"
                                onClick={() => setActiveIndex(index)}
                            >
                                <div
                                    className={`bg-white dark:brightness-85 p-3 w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 aspect-square shadow-md rounded-sm transition-all duration-500 flex items-center justify-center ${index === activeIndex
                                            ? "ring-3 ring-red-500 scale-110"
                                            : "opacity-75 hover:opacity-100 hover:ring-2 ring-red-500"
                                        }`}
                                >
                                    <img
                                        src={event.icon}
                                        alt={event.name}
                                        draggable={false}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div
                                    className={`mt-2 transition-all duration-500 ${index === activeIndex
                                            ? "font-semibold"
                                            : ""
                                        }`}
                                >
                                    <div className="">{event.name}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div className="flex-1 md:px-5 py-10"
                        variants={xVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: false, amount: 0.2 }}
                    >

                        <AnimatePresence mode="wait">
                            {activeEvent && (
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-6 bg-white dark:bg-[#222222] rounded-2xl shadow-md transition-colors duration-500"
                                >
                                    <p className="mb-3 text-lg md:text-xl font-semibold">
                                        {activeEvent.name}
                                    </p>
                                    <p className="text-neutral-700 dark:text-neutral-200">{activeEvent.description}</p>
                                    {activeEvent.link ? (
                                        <div className="mt-4 flex justify-end">
                                            <a
                                                href={activeEvent.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-red-600"
                                            >
                                                {t("BranchPage.viewMore")}
                                            </a>
                                        </div>
                                    ) : null}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Branch
