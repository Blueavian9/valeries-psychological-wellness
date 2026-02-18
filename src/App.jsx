import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
// Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import PlatformComparison from "./components/PlatformComparison";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import WellnessResources from "./components/WellnessResources";
import TherapistFinder from "./components/TherapistFinder";
import ContactCTA from "./components/ContactCTA";
import Footer from "./components/Footer";

// Pages
import BookingPage from "./pages/BookingPage";
import Dashboard from "./pages/Dashboard";

function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <PlatformComparison />
      <TherapistFinder />
      <Testimonials />
      <WellnessResources />
      <FAQ />
      <ContactCTA />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/find-therapist" element={<TherapistFinder />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
