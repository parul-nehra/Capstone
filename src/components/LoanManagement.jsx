import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaCalendarCheck, FaCalendarTimes, FaBell, FaBellSlash, FaRegClock } from 'react-icons/fa'
import { format, addMonths } from 'date-fns'
import { formatCurrency } from '../utils/formatters'

const LoanManagement = ({ loanDetails, monthlyPayment }) => {
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [nextPaymentDate, setNextPaymentDate] = useState(new Date())
  
  // If no loan details are provided, show empty state
  if (!loanDetails) {
    return (
      <div className="bg-neutral-50 p-6 rounded-md border border-neutral-200 text-neutral-500 flex items-center justify-center h-64">
        <p>No loan details available. Please calculate a loan first.</p>
      </div>
    )
  }
  
  // Generate the next 6 payment dates
  const generatePaymentDates = () => {
    const dates = []
    const currentDate = new Date()
    
    for (let i = 0; i < 6; i++) {
      const paymentDate = new Date(currentDate)
      paymentDate.setDate(loanDetails.monthlyDueDay)
      
      if (paymentDate <= currentDate) {
        paymentDate.setMonth(paymentDate.getMonth() + 1)
      }
      
      paymentDate.setMonth(paymentDate.getMonth() + i)
      
      dates.push({
        date: paymentDate,
        amount: monthlyPayment,
        isPaid: i === 0 ? false : null // First payment is not paid, others are not yet due
      })
    }
    
    return dates
  }
  
  const paymentDates = generatePaymentDates()
  
  const toggleReminder = () => {
    setReminderEnabled(!reminderEnabled)
  }
  
  const formatDateRange = (startDate, endDate) => {
    return `${format(new Date(startDate), 'MMM d, yyyy')} - ${format(new Date(endDate), 'MMM d, yyyy')}`
  }
  
  const handlePaymentToggle = (index) => {
    if (paymentDates[index].isPaid === null) return // Future dates can't be toggled
    
    const newPaymentDates = [...paymentDates]
    newPaymentDates[index].isPaid = !newPaymentDates[index].isPaid
    
    // Update the next payment date
    if (index === 0 && newPaymentDates[index].isPaid) {
      setNextPaymentDate(paymentDates[1].date)
    } else if (index === 0) {
      setNextPaymentDate(paymentDates[0].date)
    }
  }
  
  const progressPercentage = () => {
    const startTime = new Date(loanDetails.startDate).getTime()
    const endTime = new Date(loanDetails.endDate).getTime()
    const currentTime = new Date().getTime()
    
    return Math.min(100, Math.max(0, ((currentTime - startTime) / (endTime - startTime)) * 100))
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col space-y-6"
    >
      <h2 className="text-2xl font-bold text-neutral-800">Loan Management</h2>
      
      {/* Loan Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="bg-primary-600 px-6 py-4">
          <h3 className="text-white text-lg font-medium">Loan Summary</h3>
        </div>
        
        <div className="divide-y divide-neutral-200">
          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-500">Loan Type</p>
              <p className="font-medium capitalize">
                {loanDetails.loanType} Loan
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Loan Amount</p>
              <p className="font-medium">{formatCurrency(loanDetails.principal)}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Interest Rate</p>
              <p className="font-medium">{loanDetails.interestRate}%</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Term Length</p>
              <p className="font-medium">{loanDetails.termMonths} months ({(loanDetails.termMonths / 12).toFixed(1)} years)</p>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <p className="text-sm text-neutral-500">Loan Period</p>
            <div className="flex items-center mt-1">
              <FaCalendarAlt className="text-primary-500 mr-2" />
              <p className="font-medium">
                {formatDateRange(loanDetails.startDate, loanDetails.endDate)}
              </p>
            </div>
            <div className="mt-3">
              <div className="h-2 bg-neutral-200 rounded-full mt-2 w-full">
                <div 
                  className="h-2 bg-primary-500 rounded-full" 
                  style={{ width: `${progressPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>Start</span>
                <span>End</span>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaRegClock className="text-primary-500 mr-2" />
                <p className="text-sm text-neutral-700">Payment Reminders</p>
              </div>
              <button 
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                  reminderEnabled ? 'bg-primary-600' : 'bg-neutral-200'
                }`}
                onClick={toggleReminder}
              >
                <span className="sr-only">Use setting</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    reminderEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></span>
              </button>
            </div>
            <p className="text-sm text-neutral-500 mt-2">
              {reminderEnabled 
                ? 'You will receive reminders 3 days before each payment is due.'
                : 'Enable reminders to receive notifications before payments are due.'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Payment Schedule */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">Payment Schedule</h3>
          <p className="text-sm text-neutral-500">Monthly Payment: <span className="font-medium">{formatCurrency(monthlyPayment)}</span></p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentDates.map((payment, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-4 flex items-center justify-between ${
                payment.isPaid === true 
                  ? 'bg-success-50 border-success-200'
                  : payment.isPaid === false
                    ? 'bg-warning-50 border-warning-200'
                    : 'bg-neutral-50 border-neutral-200'
              }`}
            >
              <div className="flex items-center">
                {payment.isPaid === true ? (
                  <FaCalendarCheck className="text-success-500 mr-3" />
                ) : payment.isPaid === false ? (
                  <FaCalendarTimes className="text-warning-500 mr-3" />
                ) : (
                  <FaCalendarAlt className="text-neutral-400 mr-3" />
                )}
                <div>
                  <p className="font-medium">{format(payment.date, 'MMMM d, yyyy')}</p>
                  <p className="text-sm text-neutral-500">
                    {payment.isPaid === true 
                      ? 'Paid'
                      : payment.isPaid === false 
                        ? 'Due Soon'
                        : 'Upcoming'}
                  </p>
                </div>
              </div>
              {payment.isPaid !== null && (
                <button
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    payment.isPaid
                      ? 'bg-success-100 text-success-800'
                      : 'bg-white border border-warning-300 text-warning-800'
                  }`}
                  onClick={() => handlePaymentToggle(index)}
                >
                  {payment.isPaid ? 'Paid' : 'Mark Paid'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default LoanManagement