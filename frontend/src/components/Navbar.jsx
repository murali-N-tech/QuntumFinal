import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sun, Moon, LogIn, LogOut, UserPlus, Home, LayoutDashboard, BarChart2, CircleDollarSign, Newspaper, Atom, Settings } from 'lucide-react';

const logoImageUrl = "https://res.cloudinary.com/ddgfjerss/image/upload/v1756155735/lgogo2_e6tydb.svg";

const NavItem = ({ to, icon, label, t }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-quantum-accent/10 text-quantum-accent'
          : 'text-quantum-text-muted hover:bg-quantum-secondary/20 hover:text-quantum-text'
      }`
    }
  >
    {icon}
    <span className="ml-3">{t(label)}</span>
  </NavLink>
);

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: "/", icon: <Home size={18} />, label: "nav.home" },
    { to: "/dashboard", icon: <LayoutDashboard size={18} />, label: "nav.dashboard" },
    { to: "/stocks", icon: <BarChart2 size={18} />, label: "nav.stocks" },
    { to: "/crypto", icon: <CircleDollarSign size={18} />, label: "nav.crypto" },
    { to: "/forex", icon: <CircleDollarSign size={18} />, label: "nav.forex" },
    { to: "/trading", icon: <Newspaper size={18} />, label: "nav.news" },
    { to: "/portfolio", icon: <Atom size={18} />, label: "nav.optimizer" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-quantum-primary/80 backdrop-blur-lg border-b border-quantum-border' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Left Side: Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logoImageUrl} alt="QuantumFolio Logo" className="h-12 w-auto" />
            <span className="text-2xl font-bold text-quantum-text hidden md:block">
              QuantumFolio
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map(item => <NavItem key={item.to} {...item} t={t} />)}
          </nav>

          {/* Right Side: Actions */}
          <div className="flex items-center space-x-4">
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              className="border-none rounded-md px-2 py-1 bg-quantum-secondary/50 text-sm focus:outline-none focus:ring-2 focus:ring-quantum-accent text-quantum-text"
              defaultValue="en"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="te">TE</option>
              <option value="ta">TA</option>
            </select>

            <div className="relative">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-quantum-secondary/50 hover:bg-quantum-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-quantum-accent"
              >
                <Settings size={20} />
              </button>
              {isAccountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-quantum-secondary ring-1 ring-quantum-border z-20"
                >
                  <div className="py-1">
                    {!isAuthenticated ? (
                      <>
                        <Link to="/login" className="flex items-center w-full px-4 py-2 text-sm text-quantum-text-muted hover:bg-quantum-secondary/50 hover:text-quantum-text" onClick={() => setIsAccountOpen(false)}>
                          <LogIn size={16} className="mr-2" /> {t("nav.login")}
                        </Link>
                        <Link to="/register" className="flex items-center w-full px-4 py-2 text-sm text-quantum-text-muted hover:bg-quantum-secondary/50 hover:text-quantum-text" onClick={() => setIsAccountOpen(false)}>
                          <UserPlus size={16} className="mr-2" /> {t("nav.register")}
                        </Link>
                      </>
                    ) : (
                      <button onClick={() => { logout(); setIsAccountOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-quantum-secondary/50 hover:text-red-300">
                        <LogOut size={16} className="mr-2" /> {t("nav.logout")}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;