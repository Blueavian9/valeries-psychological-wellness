import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Auth
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

// Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import PlatformComparison from "./components/PlatformComparison";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import WellnessResources from "./components/WellnessResources";
import ContactCTA from "./components/ContactCTA";
import Footer from "./components/Footer";
import TherapistFinder from "./components/TherapistFinder";

// Pages
import BookingPage from "./pages/BookingPage";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

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
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/find-therapist" element={<TherapistFinder />} />

            {/* Protected routes */}
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;