import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
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

// ─── Home Page ────────────────────────────────────────────────────────────────
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

// ─── Layout: Header + Footer wrapper ─────────────────────────────────────────
// Using Outlet (React Router v6 best practice) instead of nested <Routes>
function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Dashboard: standalone, no Header/Footer, requires login ── */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ── All public routes: wrapped with Header + Footer ── */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/find-therapist" element={<TherapistFinder />} />

            {/*
              ── Booking: OPEN to guests (no ProtectedRoute) ──
              Option 3: guest-first flow, account prompt shown
              on the success screen AFTER booking is complete.
              /booking          → user picks service themselves
              /booking/:serviceId → deep link to pre-select a service
                                    (used by service cards on homepage)
            */}
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking/:serviceId" element={<BookingPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
