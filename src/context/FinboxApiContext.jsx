import { createContext, useContext, useState, useCallback } from 'react'
import { calculateLoan, getInterestRates } from '../api/finboxApi'

const FinboxApiContext = createContext()

export const useFinboxApi = () => {
  const context = useContext(FinboxApiContext)
  if (!context) {
    throw new Error('useFinboxApi must be used within a FinboxApiProvider')
  }
  return context
}

export const FinboxApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLoanCalculation = useCallback(async (principal, interestRate, termMonths, loanType) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await calculateLoan(principal, interestRate, termMonths, loanType)
      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.message || 'An error occurred while calculating the loan')
      setLoading(false)
      throw err
    }
  }, [])

  const fetchInterestRates = useCallback(async (loanType) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await getInterestRates(loanType)
      setLoading(false)
      return response.data
    } catch (err) {
      setError(err.message || 'An error occurred while fetching interest rates')
      setLoading(false)
      throw err
    }
  }, [])

  const value = {
    loading,
    error,
    fetchLoanCalculation,
    fetchInterestRates
  }

  return (
    <FinboxApiContext.Provider value={value}>
      {children}
    </FinboxApiContext.Provider>
  )
}