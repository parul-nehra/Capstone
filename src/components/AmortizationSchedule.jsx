import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { formatCurrency } from '../utils/formatters'

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const AmortizationSchedule = ({ schedule, principal }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(12)
  const [sortConfig, setSortConfig] = useState({ key: 'month', direction: 'ascending' })
  
  // If no schedule is provided, show empty state
  if (!schedule || schedule.length === 0) {
    return (
      <div className="bg-neutral-50 p-6 rounded-md border border-neutral-200 text-neutral-500 flex items-center justify-center h-64">
        <p>No amortization schedule available. Please calculate a loan first.</p>
      </div>
    )
  }
  
  // Prepare chart data
  const chartData = {
    labels: schedule.filter((_, index) => index % Math.ceil(schedule.length / 24) === 0).map(item => `Month ${item.month}`),
    datasets: [
      {
        label: 'Remaining Balance',
        data: schedule.filter((_, index) => index % Math.ceil(schedule.length / 24) === 0).map(item => item.balance),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Principal Paid',
        data: schedule.filter((_, index) => index % Math.ceil(schedule.length / 24) === 0).map(item => item.totalPrincipal),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Interest Paid',
        data: schedule.filter((_, index) => index % Math.ceil(schedule.length / 24) === 0).map(item => item.totalInterest),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  }
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += formatCurrency(context.raw);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return formatCurrency(value, 0);
          }
        }
      }
    }
  }
  
  // Sorting logic
  const sortedSchedule = [...schedule].sort((a, b) => {
    if (sortConfig.key === 'month') {
      return sortConfig.direction === 'ascending' ? a.month - b.month : b.month - a.month
    }
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1
    }
    return 0
  })
  
  // Pagination logic
  const totalPages = Math.ceil(sortedSchedule.length / rowsPerPage)
  const paginatedSchedule = sortedSchedule.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )
  
  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null
    }
    return sortConfig.direction === 'ascending' ? <FaChevronUp className="ml-1 h-3 w-3" /> : <FaChevronDown className="ml-1 h-3 w-3" />
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col space-y-6"
    >
      <h2 className="text-2xl font-bold text-neutral-800">Amortization Schedule</h2>
      
      {/* Chart */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('month')}
              >
                <div className="flex items-center">
                  Month {getSortIcon('month')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('payment')}
              >
                <div className="flex items-center">
                  Payment {getSortIcon('payment')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('principal')}
              >
                <div className="flex items-center">
                  Principal {getSortIcon('principal')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('interest')}
              >
                <div className="flex items-center">
                  Interest {getSortIcon('interest')}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('balance')}
              >
                <div className="flex items-center">
                  Remaining Balance {getSortIcon('balance')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {paginatedSchedule.map((item) => (
              <tr key={item.month} className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {item.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {formatCurrency(item.payment)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-success-700 font-medium">
                    {formatCurrency(item.principal)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-error-700 font-medium">
                    {formatCurrency(item.interest)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                  {formatCurrency(item.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 sm:px-6">
        <div className="flex items-center">
          <select
            className="mr-2 rounded-md border-neutral-300 py-1 text-sm"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={12}>12 rows</option>
            <option value={24}>24 rows</option>
            <option value={36}>36 rows</option>
          </select>
          <span className="text-sm text-neutral-700">
            Showing <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(currentPage * rowsPerPage, schedule.length)}
            </span>{' '}
            of <span className="font-medium">{schedule.length}</span> results
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-neutral-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default AmortizationSchedule