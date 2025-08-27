import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart2, Cpu, ShieldCheck } from 'lucide-react';

const FeatureCard = ({ icon, title, children }) => (
  <motion.div
    className="quantum-card p-6 text-center"
    whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(67, 206, 162, 0.2)' }}
  >
    <div className="flex justify-center items-center mb-4">
      <div className="p-3 bg-quantum-accent/10 rounded-full">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold text-quantum-accent mb-2">{title}</h3>
    <p className="text-quantum-text-muted">{children}</p>
  </motion.div>
);

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center p-8 text-white overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-quantum-primary via-quantum-secondary to-quantum-primary animate-pulse-glow"></div>
        <div className="absolute inset-0 bg-black/50"></div>

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-quantum-text glow-text">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl font-light max-w-3xl mb-8 text-quantum-text-muted">
            {t("hero.subtitle")}
          </p>
          <Link
            to="/portfolio"
            className="inline-flex items-center bg-quantum-accent text-quantum-primary font-bold py-3 px-8 rounded-full text-lg hover:bg-quantum-glow transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-quantum-accent/20"
          >
            {t("hero.ctaButton")}
            <ArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 bg-quantum-primary">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-center mb-4 text-quantum-text">The Future of Investing is Here</h2>
            <p className="text-lg text-center text-quantum-text-muted mb-12 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with comprehensive market data to give you an unparalleled advantage.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<Cpu size={28} className="text-quantum-accent" />} title="Quantum-Inspired AI">
              Harness the power of our advanced algorithms to find optimal portfolio allocations that traditional methods might miss.
            </FeatureCard>
            <FeatureCard icon={<BarChart2 size={28} className="text-quantum-accent" />} title="Comprehensive Data">
              Access real-time data for stocks, cryptocurrencies, and forex markets, all in one unified platform.
            </FeatureCard>
            <FeatureCard icon={<ShieldCheck size={28} className="text-quantum-accent" />} title="Risk Analysis">
              Our optimizer doesn't just focus on returns; it provides key metrics like Value at Risk (VaR) to help you understand your portfolio's risk profile.
            </FeatureCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;