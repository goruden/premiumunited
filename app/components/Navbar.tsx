'use client'

import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import i18next from 'i18next'
import './i18n'

type languageOption = {
    language: string
    code: string
}

const languageOptions: languageOption[] = [
    { language: "🇲🇳", code: "mn" },
    { language: "🇬🇧", code: "en" },
]

const Navbar = () => {
    const [active, setActive] = useState<string>("home")

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("displayMode")
            return saved === "dark"
        }
        return false
    })
    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newMode = !prev
            if (typeof window !== 'undefined') {
                localStorage.setItem("displayMode", newMode ? "dark" : "light")
            }
            return newMode
        })
    }
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [isDarkMode])

    const { t, i18n } = useTranslation()
    const [language, setLanguage] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("Language")
            return saved || i18next.language || "en"
        }
        return i18next.language || "en"
    })
    useEffect(() => {
        i18n.changeLanguage(language)
        document.body.dir = i18n.dir()
        if (typeof window !== 'undefined') {
            localStorage.setItem("Language", language)
        }
    }, [i18n, language])

    const [isScrolled, setIsScrolled] = useState(false)
    useEffect(() => {
        let timeoutId: number
        const handleScroll = () => {
            clearTimeout(timeoutId)
            timeoutId = window.setTimeout(() => setIsScrolled(window.scrollY > 27), 16)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", handleScroll)
            clearTimeout(timeoutId)
        }
    }, [])

    const navLinks = [
        { id: "home", label: t("Navbar.home") },
        { id: "about", label: t("Navbar.about") },
        { id: "services", label: t("Navbar.services") },
        { id: "portfolio", label: t("Navbar.portfolio") },
        { id: "contact", label: t("Navbar.contact") },
    ]

    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <div className={`fixed w-full flex items-center p-5 transition-all z-50 duration-500 ease-in-out justify-between lg:gap-10
            ${isScrolled 
                ? 'bg-black/10 backdrop-blur shadow-md dark:bg-white/10 h-16 md:h-18' 
                : 'h-24'}`}>
            <div className="lg:hidden order-1 flex-1">
                <button
                    className="flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Open menu"
                >
                    <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1"></span>
                    <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1"></span>
                    <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
                </button>
                {menuOpen && (
                    <div className="absolute top-16 bg-white dark:bg-gray-800 rounded shadow-lg py-4 px-6 z-50">
                        <ul className="flex flex-col gap-4 font-medium">
                            {navLinks.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        to={item.id}
                                        spy={true}
                                        onSetActive={setActive}
                                        onClick={() => setMenuOpen(false)}
                                        className="hover:text-red-500 cursor-pointer"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="items-center order-2 flex-2 md:flex-1">
                <Link to="home" className='cursor-pointer'>
                    <img src="/united_logo.svg" alt="Logo" className="block dark:hidden h-15" />
                    <img src="/united_logo2.svg" alt="Logo" className="hidden dark:block h-15" />
                </Link>
            </div>
            <div className="order-3 hidden lg:flex items-center justify-between w-full max-w-5xl mx-auto flex-3">
                {navLinks.map((link) => (
                    <Link
                        key={link.id}
                        to={link.id}
                        spy={true}
                        onSetActive={setActive}
                        className={`cursor-pointer transition-all duration-300 ${active === link.id ? 'font-semibold text-red-500' : ''}`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
            <div className="order-4 flex items-center gap-4 flex-1 justify-end">
                <button
                    className="rounded-md p-1 md:p-0 h-8 md:h-10 w-8 md:w-10 cursor-pointer bg-neutral-300 dark:bg-neutral-600 items-center flex justify-center"
                    onClick={toggleDarkMode}
                >
                    {isDarkMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" color='black' fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" color='black' fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>
                    )}
                </button>
                <button
                    onClick={() => {
                        const currentIdx = languageOptions.findIndex(
                            (opt) => opt.code === language
                        )
                        const nextIdx = (currentIdx + 1) % languageOptions.length
                        const nextLang = languageOptions[nextIdx].code
                        setLanguage(nextLang)
                        i18next.changeLanguage(nextLang)
                    }}
                    className="text-xl md:text-2xl lg:text-3xl justify-center rounded-md h-8 md:h-10 w-8 md:w-10 cursor-pointer bg-neutral-300 dark:bg-neutral-600 items-center"
                >
                    {languageOptions.find((opt) => opt.code === language)?.language}
                </button>
            </div>

        </div>
    )
}

export default Navbar