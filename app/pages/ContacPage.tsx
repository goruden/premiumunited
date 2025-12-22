import { useTranslation } from 'react-i18next'
import NumberFlow from "@number-flow/react"
import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Form from '@/app/components/Form'

const xVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
}

const ContactPage = () => {

    const { t } = useTranslation()
    const hrRaw = t('hr', { returnObjects: true })
    const hr = Array.isArray(hrRaw) ? hrRaw : []

    return (
        <div 
            className="max-w-6xl mx-auto pb-20 md:pb-30 py-10 md:py-20 lg:py-30 px-5 md:px-10 flex flex-col"
            id="contact"
        >
            <div className="text-center max-w-2xl mx-auto">
                <p className="mb-3 text-xs text-red-600">{t("HRPage.sub_title1")}</p>
                <p className="mb-5 text-2xl md:text-3xl font-semibold">{t("HRPage.title")}</p>
                <p className="text-body text-neutral-700 dark:text-neutral-200">{t("HRPage.line1")}</p>
            </div>

            {/* HR CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mt-10">
                {hr.map((member: any, idx: number) => (
                    <AnimatedNumberCard key={idx} member={member} index={idx} />
                ))}
            </div>

            {/* FORM + TEXT */}
            <motion.div
                variants={xVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.7 }}
                className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-5 lg:gap-3 items-start"
            >
                <div className="space-y-5">
                    <p className="text-lg md:text-xl font-semibold text-heading">
                        {t("HRPage.sub_title")}            
                    </p>
                    <p className="text-body text-neutral-700 dark:text-neutral-200">
                        {t("HRPage.sub_line")}  
                    </p>
                    <ol className="space-y-4 list-[upper-roman] list-inside text-neutral-700 dark:text-neutral-200">
                        <li>{t("HRPage.reminder1")}</li>
                        <li>{t("HRPage.reminder2")}</li>
                        <li>{t("HRPage.reminder3")}</li>
                        <li>{t("HRPage.reminder4")}</li>
                    </ol>
                    <p className="font-medium text-heading text-neutral-700 dark:text-neutral-200">{t("HRPage.sub_line2")}</p>
                    <div className="flex gap-10 ">
                        <a target="_blank" rel="noopener noreferrer" href="https://www.unegui.mn/items/author/4175682/" className="text-body underline hover:text-red-500">Unegui.mn</a>
                        <a target="_blank" rel="noopener noreferrer" href="https://www.zangia.mn/company/Premium-Nexus" className="text-body underline hover:text-red-500">Zangia.mn</a>
                    </div>
                </div>

                {/* FORM */}
                <div className="">
                    <Form />
                </div>
            </motion.div>

        </div>
    )
}

/* ------------------------ NUMBER CARD ------------------------ */
const AnimatedNumberCard = ({ member, index }: { member: any, index: number }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.6 })
    const [value, setValue] = useState(0)

    useEffect(() => {
        if (isInView) {
            let start = 0
            const end = parseInt(member.description)
            const duration = 150
            const stepTime = 20
            const steps = duration / stepTime
            const increment = end / steps

            const interval = setInterval(() => {
                start += increment
                if (start >= end) {
                    start = end
                    clearInterval(interval)
                }
                setValue(Math.floor(start))
            }, stepTime)

            return () => clearInterval(interval)
        }
    }, [isInView, member.description])

    return (
        <motion.div
            ref={ref}
            className="group flex flex-col items-center rounded-2xl"
            variants={xVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.7 }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" color='red' fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-25">
              <path strokeLinecap="round" strokeLinejoin="round" d={member.icon} />
            </svg>
            <div className="mt-5 text-xl md:text-2xl font-semibold">
                <NumberFlow value={value} />
            </div>
            <hr className="w-1/2 border-2 border-red-600 my-5" />
            <div className="text-center text-neutral-700 dark:text-neutral-200">
                {member.name}
            </div>
        </motion.div>
    )
}

export default ContactPage
