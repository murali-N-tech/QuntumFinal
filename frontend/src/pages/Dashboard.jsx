import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const sections = [
    { name: "Stocks", path: "/stocks", icon: "📈" },
    { name: "Crypto", path: "/crypto", icon: "🪙" },
    { name: "Forex", path: "/forex", icon: "🌍" },
    { name: "News", path: "/trading", icon: "📰" },
    { name: "Portfolio Optimizer", path: "/portfolio", icon: "💼" },
  ];

  return (
    <div className="bg-quantum-bg text-white min-h-screen p-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white text-center">
        Dashboard
      </h1>

      {/* Grid container with larger gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section) => (
          <Link
            to={section.path}
            key={section.name}
            className="block p-8 bg-white rounded-lg shadow-xl border-2 border-black 
                       hover:shadow-2xl hover:scale-105 transition-all duration-300 transform"
          >
            <div className="text-center">
              {/* Reactive and unique icon style */}
              <div className="text-5xl mb-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125">
                {section.icon}
              </div>

              {/* Text with fixed dark black color */}
              <h2 className="text-xl font-semibold text-black">
                {section.name}
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Explore {section.name.toLowerCase()} data and tools.
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;