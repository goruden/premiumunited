import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-scroll'
import ImageBox from '../components/ImageBox'

const HomePage = () => {
  const { t } = useTranslation()
  const containerRef = useRef(null)

  const variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const xVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <motion.section className="max-w-6xl mx-auto flex items-center px-5 md:px-10 lg:my-20" ref={containerRef}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.1 }}>
      <div className="container mx-auto py-20 flex flex-col-reverse md:flex-row items-center gap-12 text-center md:text-left">
        <div className="flex-1">
          <motion.p
            variants={xVariants}
            className="mb-3 text-base text-red-600">{t('HomePage.line1')}
          </motion.p>
          <motion.p
            variants={xVariants}
            className="mb-4 text-3xl md:text-4xl font-bold">{t('HomePage.line2')}
          </motion.p>
          <motion.p
            variants={xVariants}
            className="mb-6 text-lg md:text-xl text-neutral-700 dark:text-neutral-200">{t('HomePage.line3')}
          </motion.p>

          <motion.div
            variants={xVariants}
            className="flex justify-center md:justify-start gap-4 text-bae md:text-lg">
            <Link
              key={"about"}
              to={"about"}
              className="cursor-pointer inline-flex items-center gap-3 px-6 py-3 bg-red-600 rounded-md shadow hover:bg-red-700 focus:outline-none text-white"
              aria-label="Get started"
            >
              {t('HomePage.button1')}
            </Link>

            <Link
              key={"services"}
              to={"services"}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-md bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-300 dark:hover:bg-neutral-800 focus:outline-none transition-colors duration-500"
            >
              {t('HomePage.button2')}
            </Link>
          </motion.div>

          <motion.ul
            variants={xVariants}
            className="mt-8 flex flex-row gap-4 md:gap-8 justify-center md:justify-start text-xs md:text-base text-neutral-400">
            <li>{t('HomePage.small line1')}</li>
          </motion.ul>
        </div>

        <div className="flex-1 flex w-full justify-center">
          <ImageBox />
        </div>
      </div>
    </motion.section>
  )
}

export default HomePage