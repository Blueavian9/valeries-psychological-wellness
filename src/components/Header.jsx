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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0">
            <Link to="/" className="text-2xl font-bold text-green-600">
              Holistic Therapy
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/booking" className="text-gray-700 hover:text-green-600 transition font-medium">
              Booking
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-green-600 transition font-medium">
              Dashboard
            </Link>
            {NAV_ANCHORS.map(({ label, anchor }) => (
              <a key={anchor} href={anchor} onClick={(e) => handleAnchorClick(e, anchor)}
                className="text-gray-700 hover:text-green-600 transition cursor-pointer">
                {label}
              </a>
            ))}
          </div>
          <div className="hidden md:block">
            <Link to="/booking" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition inline-block">
              Get Started
            </Link>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-green-600">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/booking" className="block text-gray-700 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Booking</Link>
            <Link to="/dashboard" className="block text-gray-700 hover:text-green-600" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            {NAV_ANCHORS.map(({ label, anchor }) => (
              <a key={anchor} href={anchor} onClick={(e) => handleAnchorClick(e, anchor)}
                className="block text-gray-700 hover:text-green-600 cursor-pointer">
                {label}
              </a>
            ))}
            <Link to="/booking" className="block w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 text-center" onClick={() => setIsMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}