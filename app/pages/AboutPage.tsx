import About from './SubPages/About'
import Branch from './SubPages/Branch'
import Team from './SubPages/Team'
import Timeline from './SubPages/Timeline'
import CityMap from './SubPages/CityMap'
import { motion, useScroll } from "framer-motion"
import { MapThemeProvider } from "../components/MapComp/MapThemeContext"

const AboutPage = () => {

    const { scrollYProgress } = useScroll()
    return (
        <div className='transition-colors duration-500 bg-[#F2F2F2] dark:bg-[#121113]' id="about">
            <div>
                <About />
                <Branch />
                <Team />
                <Timeline />
                <MapThemeProvider observeDocumentDarkClass>
                    <CityMap />
                </MapThemeProvider>
                <motion.div
                    id="scroll-indicator"
                    className='fixed bg-red-600'
                    style={{
                        scaleX: scrollYProgress,
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        originX: 0,
                    }}
                />
            </div>
        </div>
    )
}

export default AboutPage