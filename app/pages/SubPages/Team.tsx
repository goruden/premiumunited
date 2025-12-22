import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'

const Team = () => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const xVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 }
  }

  const { t } = useTranslation()
  const teamRaw = t('team', { returnObjects: true })
  const team = Array.isArray(teamRaw) ? teamRaw : []

  function scrollToTeam() {
    setTimeout(() => {
      const teamDetailsElement = document.querySelector('.space-y-8')
      if (teamDetailsElement) {
        teamDetailsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  useEffect(() => {
    if (!team.length) {
      setSelectedIndex(null)
      return
    }

    if (selectedIndex !== null && selectedIndex >= team.length) {
      setSelectedIndex(team.length ? team.length - 1 : null)
      scrollToTeam()
    }
  }, [team.length, selectedIndex])

  const selectedMember = selectedIndex !== null ? team[selectedIndex] : null

  if (!team.length) {
    return null
  }

  return (
    <section>
      <div className="max-w-6xl mx-auto py-10 md:py-20 lg:py-30 px-10 md:px-10 text-center">
        <p className="mb-10 text-2xl md:text-3xl font-semibold">{t('TeamPage.description')}</p>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {team.map((member: any, idx: number) => (
            <motion.button
              key={`team-${idx}-${member.name || 'member'}`}
              type="button"
              variants={xVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.1 }}
              onClick={() => {
                setSelectedIndex((current) => (current === idx ? null : idx))
                if (selectedIndex !== idx) {
                  scrollToTeam()
                }
              }}
              className={`cursor-pointer group relative h-40 md:h-50 lg:h-60 overflow-hidden rounded-2xl border transition-all duration-400 ${selectedIndex === idx
                ? 'border-red-500 shadow-xl shadow-red-500/20'
                : 'border-gray-200 dark:border-gray-500 hover:border-red-400'
                }`}
            >
              <img
                src={member.photo}
                alt={member.name}
                className="absolute inset-0 h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-left text-white">
                <p className="text-sm font-semibold md:text-base">{member.name}</p>
                <p className="text-xs text-white/80 md:text-sm">{member.title}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-2 lg:items-stretch">
          <div className="relative hidden overflow-hidden rounded-3xl lg:flex lg:items-center lg:justify-center transition-colors duration-500">
            <AnimatePresence mode="wait">
              {selectedMember ? (
                <motion.div
                  key={selectedMember?.photo ?? selectedIndex ?? 'selected-member'}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -60 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.25, 0.25, 0.75] }}
                  className="relative w-full max-w-[24rem] overflow-hidden rounded-3xl"
                >
                  <img
                    src={selectedMember.photo}
                    alt={selectedMember.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                    <p className="text-xl md:text-2xl font-semibold">{selectedMember.name}</p>
                    <p className="mt-1 text-white/80">{selectedMember.title}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="team-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full w-full max-w-[24rem] flex-col items-center justify-center gap-2 px-8 text-center text-xs md:text-sm text-gray-600 dark:text-gray-300"
                >
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-20 space-y-8">
            <AnimatePresence mode="wait">
              {selectedMember && (
                <motion.div
                  key={selectedMember?.photo ?? selectedIndex ?? 'selected-member-details'}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl bg-white dark:bg-[#222222] p-3 md:p-6 shadow-lg shadow-red-500/5 backdrop-blur transition-colors duration-500"
                >
                  <div className="flex flex-col gap-5 lg:gap-6">
                    <div className="flex items-start gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-gray-200 shadow-lg dark:border-[#545554] lg:hidden">
                        <img
                          src={selectedMember.photo}
                          alt={selectedMember.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="text-left lg:ml-3">
                        <p className="text-xl md:text-2xl font-semibold">{selectedMember.name}</p>
                        <p className="text-red-600 text-sm">{selectedMember.title}</p>
                      </div>
                    </div>
                    <div className="text-justify px-3">
                      <p className="font-semibold">{selectedMember.subtitle1}</p>
                      <br />
                      <p className='text-neutral-700 dark:text-neutral-200'>{selectedMember.description1}</p>
                      <br />
                      <p className="font-semibold">{selectedMember.subtitle2}</p>
                      <br />
                      <ul className='list-disc text-neutral-700 dark:text-neutral-200'>
                        {selectedMember.description2.map((item: any, idx: number) => (
                          <li key={idx}>{item.line} {item.subtitle && <span>- {item.subtitle}</span>}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Team