import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAnchorClick = (e, anchor) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (location.pathname === "/") {
      const el = document.querySelector(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(anchor);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const NAV_ANCHORS = [
    { label: "Features", anchor: "#features" },
    { label: "Compare", anchor: "#compare" },
    { label: "FAQ", anchor: "#faq" },
    { label: "Contact", anchor: "#contact" },
  ];

  return (
    <header className="bg-[#5B21B6] border-b border-[#6D28D9] sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0">
            <Link to="/" className="text-2xl font-bold text-white">
              Holistic Therapy
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/booking"
              className="text-white/90 hover:text-[#C4B5FD] transition font-medium"
            >
              Booking
            </Link>
            <Link
              to="/dashboard"
              className="text-white/90 hover:text-[#C4B5FD] transition font-medium"
            >
              Dashboard
            </Link>
            {NAV_ANCHORS.map(({ label, anchor }) => (
              <a
                key={anchor}
                href={anchor}
                onClick={(e) => handleAnchorClick(e, anchor)}
                className="text-white/90 hover:text-[#C4B5FD] transition cursor-pointer"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="hidden md:block">
            <Link
              to="/booking"
              className="bg-[#D946EF] text-white px-6 py-2 rounded-lg hover:bg-[#A21CAF] transition inline-block"
            >
              Get Started
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#C4B5FD]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/booking"
              className="block text-white/90 hover:text-[#C4B5FD]"
              onClick={() => setIsMenuOpen(false)}
            >
              Booking
            </Link>
            <Link
              to="/dashboard"
              className="block text-white/90 hover:text-[#C4B5FD]"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            {NAV_ANCHORS.map(({ label, anchor }) => (
              <a
                key={anchor}
                href={anchor}
                onClick={(e) => handleAnchorClick(e, anchor)}
                className="block text-white/90 hover:text-[#C4B5FD] cursor-pointer"
              >
                {label}
              </a>
            ))}
            <Link
              to="/booking"
              className="block w-full bg-[#D946EF] text-white px-6 py-2 rounded-lg hover:bg-[#A21CAF] text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
