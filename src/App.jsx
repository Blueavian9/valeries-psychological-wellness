function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Dashboard: standalone full-page, no Header/Footer */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Everything else: wrapped with Header + Footer */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-white">
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/find-therapist" element={<TherapistFinder />} />
                  <Route
                    path="/booking"
                    element={
                      <ProtectedRoute>
                        <BookingPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}