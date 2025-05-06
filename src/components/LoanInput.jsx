import { motion } from 'framer-motion'
import { FaDollarSign, FaPercent, FaClock, FaTag } from 'react-icons/fa'
import { formatCurrency } from '../utils/formatters'

const LoanInput = ({
  principal,
  interestRate,
  termYears,
  termMonths,
  loanType,
  loanTypes,
  rateRange,
  onPrincipalChange,
  onInterestRateChange,
  onTermYearsChange,
  onTermMonthsChange,
  onLoanTypeChange
}) => {
  const getTermLimits = () => {
    // Different loan types have different typical terms
    switch (loanType) {
      case 'auto':
        return { min: 1, max: 7 }
      case 'personal':
        return { min: 1, max: 7 }
      case 'mortgage':
        return { min: 5, max: 30 }
      default:
        return { min: 1, max: 10 }
    }
  }
  
  const termLimits = getTermLimits()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col space-y-6"
    >
      <h2 className="text-2xl font-bold text-neutral-800">Loan Details</h2>
      
      {/* Loan Type */}
      <div>
        <label className="label" htmlFor="loanType">
          <span className="flex items-center">
            <FaTag className="mr-2 text-primary-500" />
            Loan Type
          </span>
        </label>
        <select
          id="loanType"
          className="input"
          value={loanType}
          onChange={(e) => onLoanTypeChange(e.target.value)}
        >
          {loanTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Loan Amount */}
      <div>
        <label className="label" htmlFor="principal">
          <span className="flex items-center">
            <FaDollarSign className="mr-2 text-primary-500" />
            Loan Amount
          </span>
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-neutral-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="principal"
            className="input pl-8"
            value={principal}
            min={1000}
            max={1000000}
            step={1000}
            onChange={(e) => onPrincipalChange(e.target.value)}
          />
        </div>
        <motion.div 
          className="mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="range"
            className="slider"
            min={1000}
            max={1000000}
            step={1000}
            value={principal}
            onChange={(e) => onPrincipalChange(e.target.value)}
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>$1,000</span>
            <span>$1,000,000</span>
          </div>
        </motion.div>
      </div>
      
      {/* Interest Rate */}
      <div>
        <label className="label" htmlFor="interestRate">
          <span className="flex items-center">
            <FaPercent className="mr-2 text-primary-500" />
            Interest Rate (APR)
          </span>
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            id="interestRate"
            className="input pr-8"
            value={interestRate}
            min={rateRange.min}
            max={rateRange.max}
            step={0.1}
            onChange={(e) => onInterestRateChange(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-neutral-500 sm:text-sm">%</span>
          </div>
        </div>
        <motion.div 
          className="mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input
            type="range"
            className="slider"
            min={rateRange.min}
            max={rateRange.max}
            step={0.1}
            value={interestRate}
            onChange={(e) => onInterestRateChange(e.target.value)}
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>{rateRange.min}%</span>
            <span>{rateRange.max}%</span>
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            <span>Average for {loanType} loans: {rateRange.average}%</span>
          </div>
        </motion.div>
      </div>
      
      {/* Loan Term */}
      <div>
        <label className="label" htmlFor="termYears">
          <span className="flex items-center">
            <FaClock className="mr-2 text-primary-500" />
            Loan Term
          </span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="termYears"
                className="input pr-12"
                value={termYears}
                min={termLimits.min}
                max={termLimits.max}
                step={0.5}
                onChange={(e) => onTermYearsChange(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-neutral-500 sm:text-sm">Years</span>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="termMonths"
                className="input pr-16"
                value={termMonths}
                min={termLimits.min * 12}
                max={termLimits.max * 12}
                step={1}
                onChange={(e) => onTermMonthsChange(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-neutral-500 sm:text-sm">Months</span>
              </div>
            </div>
          </div>
        </div>
        <motion.div 
          className="mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <input
            type="range"
            className="slider"
            min={termLimits.min}
            max={termLimits.max}
            step={0.5}
            value={termYears}
            onChange={(e) => onTermYearsChange(e.target.value)}
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-1">
            <span>{termLimits.min} years</span>
            <span>{termLimits.max} years</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoanInput