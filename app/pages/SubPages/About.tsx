import { useTranslation } from "react-i18next"
import { motion } from 'framer-motion'

const About = () => {
    const variants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    }

    const xVariants = {
        hidden: { opacity: 0, x: 20 },
        show: { opacity: 1, x: 0 }
    }
    const { t } = useTranslation()
    return (
        <div className="max-w-6xl mx-auto pt-3 md:pt-20">
            <div className="py-20 md:py-20 lg:py-30 px-5 md:px-10 flex flex-col-reverse lg:flex-row items-center justify-center gap-5">
                <motion.div
                    variants={variants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.1 }}
                    className="relative flex-1 shadow-xl rounded-2xl p-10 bg-white dark:bg-[#222222] transition-colors duration-500">
                    <p className="mb-2 text-xs text-red-600">{t('AboutPage.line1')}</p>
                    <h2 className="mb-4 text-2xl md:text-3xl font-semibold">{t('AboutPage.title')}</h2>
                    <p className="text-neutral-700 dark:text-neutral-200">{t('AboutPage.description')}</p>
                </motion.div>
                <motion.div
                    variants={xVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.1 }}
                    className="relative flex-1 md:mt-0">
                    <img
                        src="/2.jpg"
                        alt="About illustration"
                        loading="lazy"
                        draggable={false}
                        className="rounded-2xl shadow-xl object-cover w-full lg:w-[500px] dark:brightness-85"
                    />
                </motion.div>
            </div>
        </div>

    )
}

export default About
