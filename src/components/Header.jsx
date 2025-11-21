import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Logo from './Logo'

const Header = ({ darkMode, toggleDarkMode }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header className="py-4 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Logo />
        </Link>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-500 dark:hover:text-blue-400 font-medium">Главная</Link>
            <Link to="/concrete" className="hover:text-blue-500 dark:hover:text-blue-400 font-medium">Бетон</Link>
            <Link to="/tile" className="hover:text-blue-500 dark:hover:text-blue-400 font-medium">Плитка</Link>
            <Link to="/converter" className="hover:text-blue-500 dark:hover:text-blue-400 font-medium">Конвертер</Link>
            <Link to="/favorites" className="hover:text-blue-500 dark:hover:text-blue-400 font-medium">Избранное</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header