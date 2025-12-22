import {useRef, useState} from "react"
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
import emailjs from '@emailjs/browser'
import "./style.css"

export default function Form() {
  const form = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const sendEmail = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (form.current && !isSubmitting) {
      setIsSubmitting(true)
      emailjs.sendForm("service_56ghq9w", "template_r06m1wh", form.current, "3cgOGnELJo2TmEVP7").then(() => {
        alert(t("FormPage.success"))
        form.current?.reset()
        setIsSubmitting(false)
      }, 
      (error) => {
        alert(`${t("FormPage.error")} ${error.text}`)
        setIsSubmitting(false)
      })
    }
  }
  
  const { t } = useTranslation()

  return (
    <div className="max-w-2xl mx-auto bg-neutral-secondary-medium border-default-medium shadow-2xl rounded-2xl p-6 md:p-7 bg-white dark:bg-[#222222] transition-colors duration-500">
      <h2 className="text-lg md:text-xl font-semibold text-center">
        {t("FormPage.title")}  
      </h2>
      <p className="text-xs md:text-sm text-center text-gray-500 mt-1">
        {t("FormPage.subtitle")}
      </p>
      <form ref={form} className="mt-5 space-y-4 " onSubmit={sendEmail}>
        <div className="flex flex-wrap gap-1 leading-relaxed">
          <span>{t("FormPage.line1")}</span>
          <span>{t("FormPage.line2")}</span>
          <TextField
            required
            color="error"
            className="bottom-2 w-full"
            type="name"
            id="standard-required"
            name="name"
            label={t("FormPage.name")}
            variant="standard"
            size="small"
          />
          <span>{t("FormPage.line3")}</span>
          <TextField
            required
            color="error"
            className="bottom-2 w-full"
            type="email"
            id="standard-required"
            name="email"
            label={t("FormPage.email")}
            variant="standard"
            size="small"
          />
          <span>{t("FormPage.line4")}</span>
          <TextField
            required
            color="error"
            className="bottom-2 w-full"
            type="description"
            id="standard-required"
            name="description"
            label={t("FormPage.description")}
            variant="standard"
            size="small"
          />
        </div>
        <div className="flex flex-wrap gap-2 leading-relaxed">
          <span>{t("FormPage.line5")}</span>
          <TextField
            required
            color="error"
            type="message"
            id="outlined-multiline-static"
            name="message"
            className="w-full"
            label={t("FormPage.message")}
            multiline
            rows={3}
          />
        </div>
        
        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-xl font-semibold cursor-pointer transition-colors ${
            isSubmitting 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-500 text-white'
          }`}
        >
          {isSubmitting ? t("FormPage.submitting") : t("FormPage.submit")}
        </button>
      </form>
    </div>
  )
}
