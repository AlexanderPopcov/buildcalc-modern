import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ConcreteCalculator from './pages/ConcreteCalculator'
import TileCalculator from './pages/TileCalculator'
import Converter from './pages/Converter'
import Favorites from './pages/Favorites'
import Header from './components/Header'

const App = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/concrete" element={<ConcreteCalculator />} />
            <Route path="/tile" element={<TileCalculator />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
        
        <footer className="py-8 text-center text-gray-600 dark:text-gray-400">
          <div className="container mx-auto px-4">
            BuildCalc © {new Date().getFullYear()} - Все расчеты хранятся в вашем браузере
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App