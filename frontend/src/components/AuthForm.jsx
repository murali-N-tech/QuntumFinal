import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  return (
    <div
      className="relative flex min-h-screen p-4 bg-cover bg-center"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dmmprl5sc/image/upload/v1756163577/82_jllrqn.jpg')`, // replace with your image name in public
      }}
    >
      {/* Black overlay for collar effect */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="flex items-center justify-start w-full relative z-10">
        <div className="max-w-xl p-8 rounded-lg shadow-2xl transition-colors duration-300 hover:bg-white border-2 border-white/20 hover:border-blue-500 bg-navublue">
          <div className="text-black">
            <h2 className="text-2xl font-bold text-center mb-6">
              {isLogin ? t("auth.loginTitle") : t("auth.registerTitle")}
            </h2>
            <form onSubmit={handleSubmit}>
              {error && (
                <p className="bg-red-500 text-white p-3 rounded mb-4">
                  {error}
                </p>
              )}
              <div className="mb-4">
                <label className="block mb-2" htmlFor="email">
                  {t("auth.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2" htmlFor="password">
                  {t("auth.password")}
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading
                  ? t("auth.loading")
                  : isLogin
                  ? t("auth.loginButton")
                  : t("auth.registerButton")}
              </button>
            </form>
            <p className="text-center mt-4">
              {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
              <Link
                to={isLogin ? "/register" : "/login"}
                className="text-blue-400 hover:underline ml-1"
              >
                {isLogin ? t("auth.registerLink") : t("auth.loginLink")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;