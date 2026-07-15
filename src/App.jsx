import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import "./App.css";
// Auth
import { AuthProvider } from "./hooks/useAuth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
// Components
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Stats from "./components/Stats.jsx";
import Features from "./components/Features.jsx";
import PlatformComparison from "./components/PlatformComparison.jsx";
import Testimonials from "./components/Testimonials.jsx";
import FAQ from "./components/FAQ.jsx";
import WellnessResources from "./components/WellnessResources.jsx";
import ContactCTA from "./components/ContactCTA.jsx";
import Footer from "./components/Footer.jsx";
import TherapistFinder from "./components/TherapistFinder.jsx";
// Pages
import BookingPage from "./pages/BookingPage.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import BlogPreview from "./components/BlogPreview.jsx";

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
      <BlogPreview />
      <ContactCTA />
    </>
  );
}

// ─── Layout: Header + Footer wrapper ─────────────────────────────────────────
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
            <Route path="/find-therapist" element={<TherapistFinder />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />

            {/*
              ── Booking: OPEN to guests (no ProtectedRoute) ──
              /booking                → user picks service themselves
              /booking/:serviceId     → deep link to pre-select a service
              /booking/confirmation   → post-payment confirmation page
                                        noindexed for HIPAA + SEO
            */}
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking/:serviceId" element={<BookingPage />} />
            <Route
              path="/booking/confirmation"
              element={<BookingConfirmation />}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
