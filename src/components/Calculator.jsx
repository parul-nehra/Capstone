import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useFinboxApi } from '../context/FinboxApiContext'
import LoanInput from './LoanInput'
import LoanSummary from './LoanSummary'
import AmortizationSchedule from './AmortizationSchedule'
import LoanManagement from './LoanManagement'
import { formatCurrency } from '../utils/formatters'

const loanTypes = [
  { id: 'personal', name: 'Personal Loan' },
  { id: 'auto', name: 'Auto Loan' },
  { id: 'mortgage', name: 'Mortgage' }
]

const Calculator = () => {
  const { loading, error, fetchLoanCalculation, fetchInterestRates } = useFinboxApi()
  
  const [loanType, setLoanType] = useState('personal')
  const [principal, setPrincipal] = useState(10000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [termYears, setTermYears] = useState(3)
  const [termMonths, setTermMonths] = useState(36)
  const [loanResult, setLoanResult] = useState(null)
  const [activeTab, setActiveTab] = useState('calculator')
  
  const [rateRange, setRateRange] = useState({
    min: 3.5,
    max: 36.0,
    average: 11.5
  })

  // Calculate loan on input change
  useEffect(() => {
    const calculateLoan = async () => {
      try {
        const result = await fetchLoanCalculation(
          principal,
          interestRate,
          termMonths,
          loanType
        )
        setLoanResult(result)
      } catch (error) {
        console.error('Error calculating loan:', error)
      }
    }
    
    // Only calculate if we have valid input
    if (principal > 0 && interestRate > 0 && termMonths > 0) {
      calculateLoan()
    }
  }, [principal, interestRate, termMonths, loanType, fetchLoanCalculation])
  
  // Get interest rate ranges when loan type changes
  useEffect(() => {
    const getRates = async () => {
      try {
        const rates = await fetchInterestRates(loanType)
        setRateRange(rates)
        
        // Adjust interest rate to the average for the selected loan type
        setInterestRate(rates.average)
      } catch (error) {
        console.error('Error fetching rates:', error)
      }
    }
    
    getRates()
  }, [loanType, fetchInterestRates])
  
  // Update term months when years change
  const handleTermYearsChange = (value) => {
    const years = parseFloat(value)
    setTermYears(years)
    setTermMonths(Math.round(years * 12))
  }
  
  // Update term years when months change
  const handleTermMonthsChange = (value) => {
    const months = parseInt(value, 10)
    setTermMonths(months)
    setTermYears(months / 12)
  }
  
  const handlePrincipalChange = (value) => {
    setPrincipal(parseFloat(value))
  }
  
  const handleInterestRateChange = (value) => {
    setInterestRate(parseFloat(value))
  }
  
  const handleLoanTypeChange = (value) => {
    setLoanType(value)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'calculator':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <LoanInput 
                principal={principal}
                interestRate={interestRate}
                termYears={termYears}
                termMonths={termMonths}
                loanType={loanType}
                loanTypes={loanTypes}
                rateRange={rateRange}
                onPrincipalChange={handlePrincipalChange}
                onInterestRateChange={handleInterestRateChange}
                onTermYearsChange={handleTermYearsChange}
                onTermMonthsChange={handleTermMonthsChange}
                onLoanTypeChange={handleLoanTypeChange}
              />
            </div>
            <div className="lg:col-span-7">
              <LoanSummary 
                loading={loading}
                error={error}
                loanResult={loanResult}
              />
            </div>
          </div>
        )
      case 'schedule':
        return (
          <AmortizationSchedule 
            schedule={loanResult?.schedule || []}
            principal={principal}
          />
        )
      case 'management':
        return (
          <LoanManagement 
            loanDetails={loanResult?.loanDetails}
            monthlyPayment={loanResult?.monthlyPayment}
          />
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="card p-6"
    >
      <div className="flex flex-col space-y-6">
        <div className="flex flex-wrap border-b border-neutral-200">
          <button
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'calculator' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            } transition-colors duration-200`}
            onClick={() => setActiveTab('calculator')}
          >
            Calculator
          </button>
          <button
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'schedule' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            } transition-colors duration-200`}
            onClick={() => setActiveTab('schedule')}
            disabled={!loanResult}
          >
            Amortization Schedule
          </button>
          <button
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'management' 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            } transition-colors duration-200`}
            onClick={() => setActiveTab('management')}
            disabled={!loanResult}
          >
            Loan Management
          </button>
        </div>
        
        {renderTabContent()}
      </div>
    </motion.div>
  )
}

export default Calculator