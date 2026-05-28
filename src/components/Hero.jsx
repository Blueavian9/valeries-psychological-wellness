import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#FAE8FF] via-[#EDE9FE] to-[#E0D7FF] py-20 md:py-32 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D946EF]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C4B5FD] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-8">
            <Sparkles className="text-[#7C3AED]" size={18} />
            <span className="text-sm font-medium text-gray-700">
              Mind • Body • Spirit Integration
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Discover Your Path to
            <span className="block mt-2 bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
              Holistic Wellness
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Experience transformative therapy that treats the whole person—mind,
            body, and spirit. Find the perfect online platform for your holistic
            healing journey.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group bg-gradient-to-r from-[#C4B5FD] to-[#7C3AED] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-[#7C3AED] hover:to-[#5B21B6] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Your Journey
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button className="bg-[#7C3AED] text-white px-8 py-4 rounded-xl text-lg font-semibold border-2 border-[#7C3AED] hover:bg-[#5B21B6] hover:border-[#5B21B6] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Compare Platforms
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
              <span>Licensed Therapists</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
        <Link to="/book">Book a Session</Link>
      </div>
    </section>
  );
}
