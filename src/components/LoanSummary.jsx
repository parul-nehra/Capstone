import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaChartPie, FaCalendarAlt, FaMoneyBillWave, FaPercent } from 'react-icons/fa'
import { formatCurrency, formatPercent } from '../utils/formatters'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

const LoanSummary = ({ loading, error, loanResult }) => {
  const [chartData, setChartData] = useState({
    labels: ['Principal', 'Interest'],
    datasets: [
      {
        data: [10000, 0],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#059669', '#DC2626'],
        borderWidth: 1,
      },
    ],
  })
  
  useEffect(() => {
    if (loanResult) {
      setChartData({
        labels: ['Principal', 'Interest'],
        datasets: [
          {
            data: [
              loanResult.loanDetails.principal,
              loanResult.totalInterest
            ],
            backgroundColor: ['#10B981', '#EF4444'],
            borderColor: ['#065F46', '#991B1B'],
            borderWidth: 1,
          },
        ],
      })
    }
  }, [loanResult])
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            label += formatCurrency(context.raw);
            return label;
          }
        }
      }
    },
    cutout: '65%'
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-slow text-primary-500">
          <svg className="w-12 h-12 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-error-50 p-4 rounded-md border border-error-200 text-error-800">
        <h3 className="font-medium">Error calculating loan</h3>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    )
  }
  
  if (!loanResult) {
    return (
      <div className="bg-neutral-50 p-6 rounded-md border border-neutral-200 text-neutral-500 h-64 flex items-center justify-center">
        <p>Enter loan details to see your results</p>
      </div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col space-y-6"
    >
      <h2 className="text-2xl font-bold text-neutral-800">Loan Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Payment Card */}
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
          <div className="flex items-start">
            <div className="bg-primary-100 p-2 rounded-md">
              <FaMoneyBillWave className="text-primary-600 h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-primary-800">Monthly Payment</h3>
              <p className="mt-1 text-2xl font-bold text-primary-900">
                {formatCurrency(loanResult.monthlyPayment)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Total Interest Card */}
        <div className="bg-error-50 p-4 rounded-lg border border-error-100">
          <div className="flex items-start">
            <div className="bg-error-100 p-2 rounded-md">
              <FaPercent className="text-error-600 h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-error-800">Total Interest</h3>
              <p className="mt-1 text-2xl font-bold text-error-900">
                {formatCurrency(loanResult.totalInterest)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Total Cost Card */}
        <div className="bg-neutral-100 p-4 rounded-lg border border-neutral-200">
          <div className="flex items-start">
            <div className="bg-neutral-200 p-2 rounded-md">
              <FaCalendarAlt className="text-neutral-600 h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-neutral-800">Total Cost</h3>
              <p className="mt-1 text-2xl font-bold text-neutral-900">
                {formatCurrency(loanResult.totalPaid)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loan Breakdown Chart */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">Loan Breakdown</h3>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-64 h-64 mx-auto md:mx-0">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
          
          <div className="mt-6 md:mt-0 grid grid-cols-1 gap-3 w-full md:w-auto">
            <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-lg">
              <span className="text-sm text-neutral-700">Loan Amount:</span>
              <span className="text-sm font-medium">
                {formatCurrency(loanResult.loanDetails.principal)}
              </span>
            </div>
            <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-lg">
              <span className="text-sm text-neutral-700">Interest Rate:</span>
              <span className="text-sm font-medium">
                {formatPercent(loanResult.loanDetails.interestRate)}
              </span>
            </div>
            <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-lg">
              <span className="text-sm text-neutral-700">Loan Term:</span>
              <span className="text-sm font-medium">
                {loanResult.loanDetails.termMonths} months
              </span>
            </div>
            <div className="flex justify-between items-center bg-neutral-50 p-3 rounded-lg">
              <span className="text-sm text-neutral-700">Interest-to-Principal:</span>
              <span className="text-sm font-medium">
                {formatPercent(loanResult.totalInterest / loanResult.loanDetails.principal * 100)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LoanSummary