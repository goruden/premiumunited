'use client'

import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "@/app/lib/translations/en.json"
import mn from "@/app/lib/translations/mn.json"

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    mn: { translation: mn },
  },
  lng: "mn", 
  interpolation: { escapeValue: false },
})

export default i18n