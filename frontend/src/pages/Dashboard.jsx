import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart2, CircleDollarSign, Globe, Newspaper, Atom } from 'lucide-react';

const DashboardCard = ({ to, icon, name, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link
        to={to}
        className="block quantum-card p-8 h-full group"
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-quantum-accent/10 rounded-full mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-quantum-accent/20">
            {React.cloneElement(icon, { className: "text-quantum-accent", size: 32 })}
          </div>
          <h2 className="text-2xl font-bold text-quantum-text mb-2">
            {name}
          </h2>
          <p className="text-quantum-text-muted">
            {description}
          </p>
          <div className="mt-6 text-sm font-semibold text-quantum-accent opacity-0 group-hover:opacity-100 transition-opacity">
            Explore Section &rarr;
          </div>
        </div>
      </Link>
    </motion.div>
  );
};


const Dashboard = () => {
  const sections = [
    { name: "Stocks", path: "/stocks", icon: <BarChart2 />, description: "Analyze top-performing stocks and market trends." },
    { name: "Crypto", path: "/crypto", icon: <CircleDollarSign />, description: "Explore the volatile world of digital currencies." },
    { name: "Forex", path: "/forex", icon: <Globe />, description: "Monitor global currency pairs and exchange rates." },
    { name: "News", path: "/trading", icon: <Newspaper />, description: "Stay updated with the latest financial news." },
    { name: "Optimizer", path: "/portfolio", icon: <Atom />, description: "Run quantum-inspired portfolio optimizations." },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-quantum-text text-center glow-text">
          Market Dashboard
        </h1>
        <p className="text-quantum-text-muted mb-12 text-center max-w-2xl mx-auto">
          Your central command for navigating the complexities of the financial markets. Select a category to begin your analysis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Special card for Optimizer, spanning two columns on larger screens */}
        <div className="lg:col-span-3">
           <DashboardCard
              to="/portfolio"
              icon={<Atom />}
              name="Portfolio Optimizer"
              description="Harness the power of quantum computing. Select your assets, define your investment, and receive an optimized portfolio allocation designed to maximize returns and manage risk."
              delay={0.1}
            />
        </div>
        {sections.filter(s => s.name !== "Optimizer").map((section, index) => (
          <DashboardCard
            key={section.name}
            to={section.path}
            icon={section.icon}
            name={section.name}
            description={section.description}
            delay={0.2 + index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;