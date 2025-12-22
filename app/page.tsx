import Navbar from './components/Navbar'
import Body from './pages/Body'
import Footer from './components/Footer'

export default function Home() {
  return (
    <div className="text-black bg-white 
                    transition-colors duration-500 text-sm md:text-base
                    dark:text-white dark:bg-[#181818]">
      <Navbar />
      <Body />
      <Footer />
    </div>
  )
}
