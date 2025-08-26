import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
// These imports are assumed to be available in your project structure
// import { useAuth } from '../context/AuthContext';
// import { useLanguage } from '../context/LanguageContext';
// import { useTranslation } from 'react-i18next';

// This is a placeholder for your logo image.
// Replace this URL with your actual logo URL.
const logoImageUrl =
  "https://res.cloudinary.com/ddgfjerss/image/upload/v1756155735/lgogo2_e6tydb.svg";

const Navbar = () => {
  // Placeholder hooks for context and translation. Replace with actual hooks in your project.
  const useAuth = () => ({
    isAuthenticated: false, // Set to true to test the logged-in state
    logout: () => alert("Logging out..."),
  });
  const useLanguage = () => ({
    changeLanguage: (lang) => console.log(`Changing language to: ${lang}`),
  });
  const useTranslation = () => ({
    t: (key) => {
      const translations = {
        "nav.home": "Home",
        "nav.dashboard": "Dashboard",
        "nav.stocks": "Stocks",
        "nav.crypto": "Crypto",
        "nav.optimizer": "Optimizer",
        "nav.logout": "Logout",
        "nav.login": "Login",
        "nav.register": "Register",
        "nav.news": "News", // Added a new key for 'News'
      };
      return translations[key] || key;
    },
  });

  const { isAuthenticated, logout } = useAuth();
  const { changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // This function applies specific styles to the active navigation link
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-400 font-semibold border-b-2 border-blue-400 nav-link-reactive"
      : "text-gray-300 hover:text-blue-400 transition-colors nav-link-reactive";

  const toggleAccount = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  return (
    <header className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] shadow-md sticky top-0 z-50 text-white font-inter">
      {/* Top section with logo, title, and account info */}
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center relative">
        {/* Left: Logo and Project Name */}
        <div className="flex items-center space-x-4 mb-2 md:mb-0">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logoImageUrl} alt="Logo" className="h-12 w-auto" />
            <span className="text-2xl font-semibold glow-text md:hidden">
              Portfolio Analyzer
            </span>
          </Link>
        </div>

        {/* Center: Project Name on medium and larger screens */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          {/* Made heading bigger from text-4xl to text-5xl */}
          <h1 className="text-5xl font-bold glow-text">Portfolio Analyzer</h1>
        </div>

        {/* Right: Language and Account */}
        <div className="flex items-center space-x-4">
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            className="border-none rounded-md px-2 py-1 bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            defaultValue="en"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="te">TE</option>
            <option value="ta">TA</option>
          </select>

          <div className="relative">
            <button
              onClick={toggleAccount}
              className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Account
            </button>
            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-20">
                {!isAuthenticated ? (
                  <div className="py-1">
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={toggleAccount}
                    >
                      {t("nav.login")}
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                      onClick={toggleAccount}
                    >
                      {t("nav.register")}
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      toggleAccount();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700 hover:text-red-400 focus:outline-none"
                  >
                    {t("nav.logout")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navbar for navigation links */}
      <nav className="bg-gray-900 py-2 md:py-3 border-t border-gray-700">
        <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-around items-center text-sm md:text-base space-x-2 md:space-x-4">
          <NavLink to="/" className={navLinkClass}>
            <span className="nav-icon">🏠</span> {t("nav.home")}
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            <span className="nav-icon">📊</span> {t("nav.dashboard")}
          </NavLink>
          <NavLink to="/stocks" className={navLinkClass}>
            <span className="nav-icon">📈</span> {t("nav.stocks")}
          </NavLink>
          <NavLink to="/crypto" className={navLinkClass}>
            <span className="nav-icon">₿</span> {t("nav.crypto")}
          </NavLink>
          <NavLink to="/forex" className={navLinkClass}>
            <span className="nav-icon">💱</span> Forex
          </NavLink>
          <NavLink to="/trading" className={navLinkClass}>
            <span className="nav-icon">📰</span> {t("nav.news")}
          </NavLink>
          <NavLink to="/portfolio" className={navLinkClass}>
            <span className="nav-icon">⚛️</span> {t("nav.optimizer")}
          </NavLink>
        </div>
      </nav>

      <style jsx>{`
        .font-inter {
          font-family: "Inter", sans-serif;
        }

        /* Enhanced glow effect for the heading */
        .glow-text {
          color: #43cea2;
          text-shadow: 0 0 8px #43cea2, 0 0 16px #43cea2;
          transition: text-shadow 0.3s ease-in-out;
        }

        .glow-text:hover {
          text-shadow: 0 0 16px #43cea2, 0 0 32px #43cea2;
        }

        .nav-icon {
          margin-right: 0.3rem;
          transition: transform 0.3s ease-in-out;
        }

        .nav-link-reactive:hover .nav-icon {
          transform: translateY(-2px) scale(1.1);
        }

        /* This is the reactive quantum animation on hover */
        .nav-link-reactive {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 0.75rem;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .nav-link-reactive:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: #43cea2; /* Quantum Aurora glow color */
          transition: width 0.3s ease-in-out, left 0.3s ease-in-out;
        }

        .nav-link-reactive:hover:after {
          width: 100%;
          left: 0;
        }

        .nav-link-reactive.active:after {
          width: 100%;
          left: 0;
          background-color: #43cea2;
        }

        @keyframes pulse-bg {
          0% {
            background-size: 100% 100%;
            background-position: 0% 50%;
          }
          50% {
            background-size: 110% 110%;
            background-position: 100% 50%;
          }
          100% {
            background-size: 100% 100%;
            background-position: 0% 50%;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
