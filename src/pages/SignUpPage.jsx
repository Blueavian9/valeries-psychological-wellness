import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SignUpPage() {
  const { signInWithMagicLink } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signInWithMagicLink(email);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">💚</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Check your email!
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            We sent a link to <strong>{email}</strong>. Click it to activate
            your account — no password to remember.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold rounded-xl text-sm transition"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-teal-600 to-green-700 flex-col justify-between p-12 text-white">
        <div className="text-2xl font-bold tracking-tight">
          🌿 Holistic Therapy
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-6">
            Begin your path
            <br />
            to healing today.
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { icon: "✨", text: "Free to create an account" },
              { icon: "🧠", text: "Personalized therapist matching" },
              { icon: "📅", text: "Easy online booking" },
              { icon: "🔒", text: "HIPAA-compliant & secure" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 text-green-100"
              >
                <span className="text-xl">{icon}</span>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-green-200 text-xs">
          © 2026 Valerie's Psychological Wellness
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h1>
            <p className="text-gray-500 text-sm">
              Start your wellness journey — no password required
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent text-sm transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-[#7C3AED] hover:bg-[#5B21B6] disabled:bg-green-300 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send sign-in link"
              )}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By signing up you agree to our{" "}
              <a href="#" className="text-[#7C3AED] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#7C3AED] hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#7C3AED] hover:text-[#5B21B6] font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
