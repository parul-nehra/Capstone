import axios from 'axios'

// In a real application, you would store this in an environment variable
// and proxy requests through a backend to keep it secure
// This is a placeholder for demonstration purposes
const API_KEY = 'YOUR_FINBOX_API_KEY'

const baseURL = 'https://api.finbox.com/v1'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
})

// For demo purposes, we'll simulate the API response
// In a real application, you would replace this with actual API calls
export const calculateLoan = async (
  principal,
  interestRate,
  termMonths,
  loanType = 'personal'
) => {
  // In a real application, you would use:
  // return api.post('/loans/calculate', {
  //   principal,
  //   interestRate,
  //   termMonths,
  //   loanType
  // })
  
  // Simulated API response
  const monthlyRate = interestRate / 100 / 12
  const totalPayments = termMonths
  
  let monthlyPayment = 0
  if (monthlyRate !== 0) {
    monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments) / (Math.pow(1 + monthlyRate, totalPayments) - 1)
  } else {
    monthlyPayment = principal / totalPayments
  }
  
  const totalPaid = monthlyPayment * totalPayments
  const totalInterest = totalPaid - principal
  
  // Create amortization schedule
  const schedule = []
  let balance = principal
  let totalPrincipalPaid = 0
  let totalInterestPaid = 0
  
  for (let month = 1; month <= totalPayments; month++) {
    const interestPayment = balance * monthlyRate
    const principalPayment = monthlyPayment - interestPayment
    balance -= principalPayment
    
    totalPrincipalPaid += principalPayment
    totalInterestPaid += interestPayment
    
    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      totalPrincipal: totalPrincipalPaid,
      totalInterest: totalInterestPaid,
      balance: Math.max(0, balance),
    })
  }
  
  const startDate = new Date()
  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + termMonths)
  
  return {
    data: {
      monthlyPayment,
      totalInterest,
      totalPaid,
      schedule,
      loanDetails: {
        startDate,
        endDate,
        monthlyDueDay: startDate.getDate(),
        principal,
        interestRate,
        termMonths,
        loanType
      }
    }
  }
}

export const getInterestRates = async (loanType = 'personal') => {
  // In a real application, you would use:
  // return api.get(`/rates/${loanType}`)
  
  // Simulated API response
  const rates = {
    personal: {
      min: 5.5,
      max: 36.0,
      average: 11.5
    },
    auto: {
      min: 3.5,
      max: 18.0,
      average: 6.5
    },
    mortgage: {
      min: 2.5,
      max: 8.5,
      average: 5.0
    }
  }
  
  return {
    data: rates[loanType] || rates.personal
  }
}

export default api