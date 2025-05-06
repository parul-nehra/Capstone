import { useState } from 'react'
import Header from './components/Header'
import Calculator from './components/Calculator'
import Footer from './components/Footer'
import { FinboxApiProvider } from './context/FinboxApiContext'

function App() {
  const [calculatorKey, setCalculatorKey] = useState(0)

  const resetCalculator = () => {
    setCalculatorKey(prevKey => prevKey + 1)
  }

  return (
    <FinboxApiProvider>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header onReset={resetCalculator} />
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Calculator key={calculatorKey} />
          </div>
        </main>
        <Footer />
      </div>
    </FinboxApiProvider>
  )
}

export default App