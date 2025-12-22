'use client'

import { useTranslation } from "react-i18next"
import HomePage from "./HomePage"
import AboutPage from "./AboutPage"
import ServicePage from "./ServicePage"
import PortfolioPage from "./PortfolioPage"
import ContactPage from "./ContacPage"
import Shipment from "./Shipment"

const Body = () => {
  const { t } = useTranslation()
  return (
    <div
      id="home"
      className="pt-5 md:pt-20 min-h-screen flex flex-col "
    >
      <HomePage />
      <AboutPage />
      <ServicePage />
      <Shipment />
      <PortfolioPage />
      <ContactPage />
      {/* {t('AboutPage.description')} */}
    </div>
  )
}

export default Body