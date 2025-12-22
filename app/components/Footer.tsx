'use client'

import { useTranslation } from "react-i18next"
import { Link } from "react-scroll"

const Footer = () => {
  const { t } = useTranslation()
  const links = [
    { href: "home", label: t("Navbar.home") },
    { href: "about", label: t("Navbar.about") },
    { href: "services", label: t("Navbar.services") },
    { href: "portfolio", label: t("Navbar.portfolio") },
  ]
  const contactInfo = [
    { icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z", text: t("ContactPage.address") },
    { icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z", text: t("ContactPage.phone") },
    { icon: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75", text: t("ContactPage.email") },
  ]

  return (
    <footer
      className="bg-[#F2F2F2] dark:bg-[#121113] "
    >
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <div className="flex items-center">
              <img src="united_logo.svg" className="dark:hidden" height={50} alt="logo" draggable={false}/>
              <img src="united_logo2.svg" className="hidden dark:block" height={50} alt="logo" draggable={false}/>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t("ContactPage.description")}
            </p>
          </div>
          <div className="space-y-3">
            <p className="font-semibold">{t("ContactPage.links")}</p>
            <div className="grid grid-cols-2 gap-2 text-neutral-600 dark:text-neutral-400">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="hover:text-red-500 transition-colors cursor-pointer underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-2 mt-2">
            <p className="font-semibold">{t("ContactPage.title")}</p>
            {contactInfo.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                {/* <img
                  src={item.icon}
                  alt=""
                  className="w-4 h-4 invert-20 dark:invert-80 transition duration-200"
                /> */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="py-4 text-center text-xs">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">Premium United</span>. All rights
          reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
