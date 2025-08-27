import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center text-center container mx-auto px-4 py-16">
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
    >
      <AlertTriangle className="text-yellow-400" size={80} />
    </motion.div>
    <motion.h1
      className="text-6xl font-extrabold text-quantum-text mt-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      404
    </motion.h1>
    <motion.p
      className="text-2xl mt-4 text-quantum-text-muted"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      Quantum State Not Found
    </motion.p>
    <motion.p
      className="text-quantum-text-muted mt-2 max-w-sm"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      It seems you've ventured into an unknown quadrant. The page you are looking for does not exist.
    </motion.p>
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Link to="/" className="mt-8 inline-flex items-center bg-quantum-accent text-quantum-primary font-bold py-3 px-6 rounded-full text-lg hover:bg-quantum-glow transition-all duration-300 transform hover:scale-105">
        <Home className="mr-2" size={20} />
        Return to Homepage
      </Link>
    </motion.div>
  </div>
);

export default NotFound;