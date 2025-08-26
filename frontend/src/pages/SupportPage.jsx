// src/pages/SupportPage.jsx

import React from 'react';

const SupportPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 text-gray-300">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-white drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]">
        Support Center
      </h1>
      <p className="text-center text-gray-400 mb-12">
        Have questions? We're here to help you navigate the quantum realm of finance.
      </p>

      {/* Contact Info Section */}
      <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700 mb-12">
        <h2 className="text-2xl font-semibold text-purple-300 mb-4">Contact Us</h2>
        <p className="text-gray-400 mb-6">
          The best way to reach us is via email or our community Discord. We'll get back to you as soon as possible.
        </p>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="text-pink-400 font-bold w-24">Email:</span>
            <a href="mailto:support@stackzy.com" className="text-gray-300 hover:underline">support@stackzy.com</a>
          </div>
          <div className="flex items-center">
            <span className="text-pink-400 font-bold w-24">Discord:</span>
            <a href="#" className="text-gray-300 hover:underline">Join our Community Server</a>
          </div>
          <div className="flex items-center">
            <span className="text-pink-400 font-bold w-24">Twitter:</span>
            <a href="#" className="text-gray-300 hover:underline">@StackZyQuantum</a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-3xl font-semibold text-center text-purple-300 mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          <div className="bg-gray-800/30 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">What is QAOA and why do you use it?</h3>
            <p className="text-gray-400 leading-relaxed">
              QAOA stands for the Quantum Approximate Optimization Algorithm. It's a method designed to run on quantum computers to solve complex optimization problems. We use a quantum-inspired version of it to find the best possible mix of assets in a portfolio, balancing risk and potential reward in a way that is difficult for classical computers.
            </p>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">How accurate are the portfolio optimizations?</h3>
            <p className="text-gray-400 leading-relaxed">
              Our tool provides a mathematically optimized portfolio based on historical data and the relationships between assets. However, all financial markets are subject to volatility and unpredictable events. The results should be used as a powerful analytical insight, not as guaranteed financial advice.
            </p>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Is my financial data secure?</h3>
            <p className="text-gray-400 leading-relaxed">
              Absolutely. As outlined in our Quantum Principles, we treat your data with the highest level of security. All data is handled in an encrypted, anonymized state. We do not store sensitive personal financial information on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;