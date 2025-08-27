import React, { useState, useEffect } from 'react';
import api from '../services/api';
import useAutoTranslate from '../hooks/useAutoTranslate';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const TranslatedArticle = ({ article, index }) => {
  const { translatedText: translatedHeadline } = useAutoTranslate(article.headline);
  const { translatedText: translatedSummary } = useAutoTranslate(article.summary);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block quantum-card p-6 group"
      >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-semibold text-quantum-accent mb-1">{article.source}</p>
                <h2 className="text-lg font-bold text-quantum-text mb-2 group-hover:text-quantum-accent transition-colors">{translatedHeadline}</h2>
            </div>
            <ExternalLink className="text-quantum-text-muted group-hover:text-quantum-accent transition-colors flex-shrink-0 ml-4" size={20} />
        </div>
        <p className="text-sm text-quantum-text-muted">{translatedSummary}</p>
        <p className="text-xs text-quantum-text-muted mt-4">
          {new Date(article.datetime * 1000).toLocaleString()}
        </p>
      </a>
    </motion.div>
  );
};


const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/screener/trading/news");
        setNews(response.data);
      } catch (err) {
        setError("Failed to fetch market news. The API limit may have been reached.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-quantum-text text-center glow-text">
          Market News
        </h1>
        <p className="text-quantum-text-muted mb-8 text-center max-w-2xl mx-auto">
          Top general news from the financial world to keep you informed.
        </p>
      </motion.div>

      {isLoading ? (
        <p className="text-center p-16 text-quantum-text-muted">Loading latest market news...</p>
      ) : error ? (
        <p className="text-center p-16 text-red-400">{error}</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {news.map((article, index) => (
            <TranslatedArticle key={article.id} article={article} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;