import { FaHeart } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          <div className="mt-4 md:mt-0 flex items-center">
          </div>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-neutral-500 hover:text-primary-600 text-sm">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-500 hover:text-primary-600 text-sm">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-500 hover:text-primary-600 text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer