import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const ServicePage = () => {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    const xVariants = {
        hidden: { opacity: 0, x: 20 },
        show: { opacity: 1, x: 0 }
    }
    const { t } = useTranslation()
    // const teamRaw = t('services', { returnObjects: true })
    // const services = Array.isArray(teamRaw) ? teamRaw : []

    const ref = useRef<HTMLDivElement>(null)

    return (
        <div ref={ref} id="services" className="max-w-6xl w-full mx-auto pt-20 lg:pt-30 px-10">
            <motion.p
                variants={variants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="text-center text-xs text-red-600 mb-3"
            >
                {t('ServicesPage.sub_title')}
            </motion.p>
            <motion.p
                variants={variants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="text-center text-2xl md:text-3xl font-semibold mb-5"
            >
                {t('ServicesPage.title')}
            </motion.p>

            <motion.p
                variants={variants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="text-center mb-5 text-neutral-700 dark:text-neutral-200"
            >
                {t('ServicesPage.description')}
            </motion.p>

            <div className="flex flex-col gap-10">
                <motion.div
                    variants={variants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='md:col-span-2 lg:col-span-1'>
                            <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                                {t('Services.subtitle1')}
                            </p>
                            <p className='text-lg md:text-xl font-semibold'>
                                {t('Services.title1')}
                            </p>
                            <p className='text-neutral-700 dark:text-neutral-200'>
                                {t('Services.description1')}
                            </p>
                        </div>
                        <div className="md:row-span-2 md:col-span-1">
                            <img src='./1.jpg' draggable={false} className='rounded-2xl h-100 md:h-144 w-full object-cover' />
                        </div>
                        <div className='grid gap-4'>
                            <img src='./10.jpg' draggable={false} className='rounded-2xl h-70 w-full object-cover' />
                            <img src='./15.jpg' draggable={false} className='rounded-2xl h-70 w-full object-cover' />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={variants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className=''
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='lg:order-2 col-span-2 lg:col-span-1'>
                            <p className='text-sm text-neutral-500 dark:text-neutral-400'>
                                {t('Services.subtitle2')}
                            </p>
                            <p className='text-lg md:text-xl font-semibold'>
                                {t('Services.title2')}
                            </p>
                            <p className='text-neutral-700 dark:text-neutral-200'>
                                {t('Services.description2')}
                            </p>
                        </div>
                        <div className='col-span-1 md:col-span-2 md:grid md:grid-rows-2 gap-4 space-y-4 md:space-y-0'>
                            <img src='./10.jpg' draggable={false} className='col-span-2 w-full rounded-2xl h-70 object-cover' />
                            <img src='./15.jpg' draggable={false} className='rounded-2xl h-70 w-full object-cover' />
                            <img src='./15.jpg' draggable={false} className='rounded-2xl h-70 w-full object-cover' />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={variants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    className=''
                >
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='md:col-span-2 lg:col-span-1'>
                            <p className='text-sm text-neutral-500 dark:text-neutral-400'>
                                {t('Services.subtitle3')}
                            </p>
                            <p className='text-lg md:text-xl font-semibold'>
                                {t('Services.title3')}
                            </p>
                            <p className='text-neutral-700 dark:text-neutral-200'>
                                {t('Services.description3')}
                            </p>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <img src='./10.jpg' draggable={false} className='rounded-2xl h-70 w-full object-cover' />
                            <img src='./15.jpg' draggable={false} className='rounded-2xl h-70 w-full object-cover' />
                        </div>
                        <div className="">
                            <img src='./3.jpg' draggable={false} className='rounded-2xl h-100 md:h-144 w-full object-cover' />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default ServicePage
