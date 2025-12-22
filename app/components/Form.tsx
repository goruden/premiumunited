import {useRef} from "react"
// import FormControl from "@mui/material/FormControl"
// import InputLabel from "@mui/material/InputLabel"
import TextField from '@mui/material/TextField'
import { useTranslation } from 'react-i18next'
// import MenuItem from "@mui/material/MenuItem"
// import { IMaskInput } from 'react-imask'
// import Input from "@mui/material/Input"
import emailjs from '@emailjs/browser'
import "./style.css"

// interface CustomProps {
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
//   name: string
// }

// const TextMaskCustom = React.forwardRef<HTMLInputElement, CustomProps>(
//   function TextMaskCustom(props, ref) {
//     const { onChange, ...other } = props
//     return (
//       <IMaskInput
//         {...other}
//         mask="0000-0000"
//         definitions={{
//           '#': /[1-9]/,
//         }}
//         inputRef={ref}
//         onAccept={(value: any) => {
//           const event = {
//             target: {
//               name: props.name,
//               value: value,
//             },
//           } as React.ChangeEvent<HTMLInputElement>
//           onChange(event)
//         }}
//         overwrite
//       />
//     )
//   },
// )

export default function Form() {
  const form = useRef<HTMLFormElement>(null)
  const sendEmail = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (form.current) {
      emailjs.sendForm("service_56ghq9w", "template_r06m1wh", form.current, "3cgOGnELJo2TmEVP7").then(() => {
        alert("SUCCESS")
        form.current?.reset()
      }, 
      (error) => {
        alert(`ERROR: ${error.text}`)
      })
    }
  }

  // const handleSubmit = (e: { preventDefault: () => void }) => {
  //   e.preventDefault()
  // }
  
  const { t } = useTranslation()
  // const [values, setValues] = React.useState({
  //   textmask: '0000-0000',
  //   numberformat: '1320',
  // })

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setValues({
  //     ...values,
  //     [event.target.name]: event.target.value,
  //   })
  // }
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
          className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-semibold"
        >
          {t("FormPage.submit")}
        </button>
      </form>
    </div>
  )
}
