import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-green-600">
              Holistic Therapy
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-green-600 transition">Features</a>
            <a href="#compare" className="text-gray-700 hover:text-green-600 transition">Compare</a>
            <a href="#faq" className="text-gray-700 hover:text-green-600 transition">FAQ</a>
            <a href="#contact" className="text-gray-700 hover:text-green-600 transition">Contact</a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#features" className="block text-gray-700 hover:text-green-600">Features</a>
            <a href="#compare" className="block text-gray-700 hover:text-green-600">Compare</a>
            <a href="#faq" className="block text-gray-700 hover:text-green-600">FAQ</a>
            <a href="#contact" className="block text-gray-700 hover:text-green-600">Contact</a>
            <button className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              Get Started
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}