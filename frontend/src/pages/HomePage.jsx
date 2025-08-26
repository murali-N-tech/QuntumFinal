import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero Section with a new 'id' */}
      <div
        id="hero"
        className="flex flex-col items-center justify-center min-h-screen text-white text-center p-8 bg-gradient-to-b from-[#0D1117] to-[#1A237E] via-[#302b63]"
      >
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 animate-fade-in-up">
          {t("hero.title")}
        </h1>
        <p className="text-xl md:text-2xl font-light max-w-3xl mb-8 animate-fade-in-up delay-150">
          {t("hero.subtitle")}
        </p>
        <Link
          to="/portfolio"
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 animate-fade-in-up delay-300"
        >
          {t("hero.ctaButton")}
        </Link>
      </div>

      {/* Home Section with a new 'id' */}
      <div
        id="home"
        className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-gradient-to-t from-[#0D1117] to-[#1A237E] text-white"
      >
        <h2 className="text-5xl md:text-7xl font-bold mb-4">
          {t("home.title")}
        </h2>
        <p className="text-lg md:text-xl text-gray-400 mb-8">
          {t("home.subtitle")}
        </p>
        <Link
          to="/portfolio"
          className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
        >
          {t("home.ctaButton")}
        </Link>
      </div>
    </div>
  );
};

export default HomePage;