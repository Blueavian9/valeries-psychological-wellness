import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Features from './components/Features'
import PlatformComparison from './components/PlatformComparison'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import ContactCTA from './components/ContactCTA'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Stats />
                <Features />
                <PlatformComparison />
                <Testimonials />
                <FAQ />
                <ContactCTA />
              </>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App