import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

// A sub-component for the computer graphic to keep the main component clean
const ComputerGraphic = ({ isLogin }) => {
  const [isFlickering, setIsFlickering] = useState(false);

  // Trigger flicker animation whenever the form type changes
  useEffect(() => {
    setIsFlickering(true);
    const timer = setTimeout(() => setIsFlickering(false), 300); // Duration of the flicker
    return () => clearTimeout(timer);
  }, [isLogin]);

  return (
    <div className="relative w-full h-48 md:h-64">
      {/* Computer Monitor Frame */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-sm bg-gray-300 dark:bg-gray-700 p-2 rounded-lg shadow-lg">
          <div
            className={`w-full h-32 md:h-48 bg-gray-900 rounded-md flex items-center justify-center overflow-hidden transition-all duration-300 ${isFlickering ? 'animate-flicker' : ''}`}
          >
            {/* Screen Content */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="text-4xl font-black text-gray-400 tracking-widest"
              >
                {isLogin ? "LOGIN" : "REGISTER"}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Computer Stand */}
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-1/3 h-5 bg-gray-400 dark:bg-gray-600 rounded-b-md"></div>
      <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-1/2 h-2.5 bg-gray-500 dark:bg-gray-800 rounded-b-lg"></div>
    </div>
  );
};


const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('dark');

  const { login, register } = useAuth(); // Assuming useAuth is correctly set up
  const navigate = useNavigate();
  const { t } = useTranslation(); // Assuming i18next is correctly set up

  // Toggle theme and update the html tag for Tailwind's dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
      >
        <source
          src="https://ik.imagekit.io/murali17/Science%20and%20Technology%20Education%20Video%20in%20Blue%20and%20White%20.mp4?updatedAt=1756224212992"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10"></div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
      </button>

      {/* Main Content */}
      <div className="relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center max-w-4xl w-full">
        {/* Left Side: Computer Graphic */}
        <div className="hidden md:flex items-center justify-center p-4">
          <ComputerGraphic isLogin={isLogin} />
        </div>

        {/* Right Side: Glassmorphism Form */}
        <div
          className={`
            w-full p-8 rounded-2xl shadow-2xl transition-all duration-500
            border border-white/20
            bg-white/10 backdrop-blur-lg
            ${!isLogin ? 'shadow-blue-500/50' : 'shadow-black/30'}
          `}
        >
          <div className="text-white">
            <AnimatePresence mode="wait">
              <motion.h2
                key={isLogin ? 'loginTitle' : 'registerTitle'}
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-3xl font-bold text-center mb-6"
              >
                {isLogin ? "Welcome Back" : "Create Account"}
              </motion.h2>
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              {error && (
                <p className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
                  {error}
                </p>
              )}
              <div className="mb-4">
                <label className="block mb-2 text-sm" htmlFor="email">
                  E-Mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-black/30 text-white border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-black/30 text-white border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
              </button>
            </form>

            <div className="text-center mt-6 text-sm">
              <AnimatePresence mode="wait">
                <motion.p
                  key={isLogin ? 'noAccount' : 'hasAccount'}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <Link
                    to={isLogin ? "/register" : "/login"}
                    className="text-blue-400 hover:underline font-semibold ml-2"
                  >
                    {isLogin ? "Register" : "Login"}
                  </Link>
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;