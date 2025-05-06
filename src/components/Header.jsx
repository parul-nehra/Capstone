import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCalculator } from 'react-icons/fa'

const Header = ({ onReset }) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  return (
    <header 
      className={`sticky top-0 z-10 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaCalculator className="h-8 w-8 text-primary-600 mr-3" />
            <h1 className="text-2xl font-bold text-primary-800">LoanCalc Pro</h1>
          </motion.div>
          
          <motion.button
            className="btn btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
          >
            New Calculation
          </motion.button>
        </div>
      </div>
    </header>
  )
}

export default Header