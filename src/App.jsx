import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import PlatformComparison from "./components/PlatformComparison";
import WellnessResources from "./components/WellnessResources";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import ContactCTA from "./components/ContactCTA";
import BookingPage from "./pages/BookingPage";
import Dashboard from "./pages/Dashboard";
import TherapistFinder from "./components/TherapistFinder";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Dashboard has its own full-screen layout — no Header/Footer */}
          <Route path="/dashboard/*" element={<Dashboard />} />

          {/* All public-facing pages share Header + Footer */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <main>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <>
                          <Hero />
                          <Stats />
                          <Features />
                          <PlatformComparison />
                          <WellnessResources />
                          <Testimonials />
                          <FAQ />
                          <ContactCTA />
                          <TherapistFinder />
                        </>
                      }
                    />
                    <Route path="/book" element={<BookingPage />} />
                    <Route path="/book/:serviceId" element={<BookingPage />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
