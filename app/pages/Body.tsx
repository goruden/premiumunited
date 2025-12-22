'use client'

import { useTranslation } from "react-i18next"
import HomePage from "./HomePage"
import AboutPage from "./AboutPage"
import ServicePage from "./ServicePage"
import PortfolioPage from "./PortfolioPage"
import ContactPage from "./ContacPage"

const Body = () => {
  const { t } = useTranslation()
  return (
    <div
      id="home"
      className="pt-20 min-h-screen flex flex-col gap-10"
    >
      <HomePage />
      <AboutPage />
      <ServicePage />
      <PortfolioPage />
      <ContactPage />
      {/* {t('AboutPage.description')} */}
    </div>
  )
}

export default Body