import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import MultiLineChart from '../components/LineChart'; // Assuming this is your interactive chart
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart, Info, Building } from 'lucide-react';

const DataPoint = ({ label, value, icon }) => (
  <div className="flex justify-between items-center py-3 border-b border-quantum-border last:border-b-0">
    <div className="flex items-center text-quantum-text-muted">
      {icon}
      <span className="ml-2">{label}</span>
    </div>
    <span className="font-bold text-quantum-text">{value}</span>
  </div>
);

const AssetDetailPage = () => {
  const { symbol } = useParams();
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssetData = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError('');
        const [profileRes, historyRes] = await Promise.all([
            api.get(`/screener/profile/${symbol}`),
            api.get(`/portfolios/history/${symbol}`)
        ]);

        setProfile(profileRes.data);
        const processedHistory = historyRes.data.map(item => ({
            date: item.date,
            [symbol]: item.price 
        }));
        setHistory(processedHistory);
      } catch (err) {
        setError('Failed to fetch asset details. The asset may not be supported or API limits were reached.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssetData();
  }, [symbol, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold text-quantum-text">Authentication Required</h2>
        <p className="mt-2 text-quantum-text-muted">
          Please <Link to="/login" className="text-quantum-accent hover:underline">log in</Link> to view asset details.
        </p>
      </div>
    );
  }

  if (isLoading) return <p className="text-center py-16 text-quantum-text-muted">Loading asset details for {symbol}...</p>;
  if (error) return <p className="text-center py-16 text-red-400">{error}</p>;
  if (!profile) return <p className="text-center py-16 text-quantum-text-muted">No data available for this asset.</p>;

  const isPositiveChange = profile.changes >= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <img src={profile.image} alt={profile.companyName} className="w-16 h-16 mr-4 rounded-full" />
            <div>
              <h1 className="text-4xl font-bold text-quantum-text">{profile.symbol}</h1>
              <p className="text-quantum-text-muted">{profile.companyName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-quantum-text">${profile.price?.toFixed(2)}</p>
            <p className={`text-lg font-semibold flex items-center justify-end ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
              {isPositiveChange ? <TrendingUp size={20} className="mr-1" /> : <TrendingDown size={20} className="mr-1" />}
              {profile.changes?.toFixed(2)} ({((profile.changes / (profile.price - profile.changes)) * 100).toFixed(2)}%)
            </p>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2 quantum-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-quantum-accent mb-4">Price History (1Y)</h2>
          <div className="h-[400px]">
            <MultiLineChart data={history} assets={[symbol]} />
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-1 quantum-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-quantum-accent mb-4">Key Information</h2>
          <div className="space-y-2">
            <DataPoint label="Market Cap" value={`$${(profile.mktCap || 0).toLocaleString()}`} icon={<Building size={16}/>} />
            <DataPoint label="Volume" value={(profile.volume || 0).toLocaleString()} icon={<BarChart size={16}/>} />
            <DataPoint label="Day High" value={`$${(profile.dayHigh || 0).toFixed(2)}`} icon={<TrendingUp size={16}/>} />
            <DataPoint label="Day Low" value={`$${(profile.dayLow || 0).toFixed(2)}`} icon={<TrendingDown size={16}/>} />
            <DataPoint label="Industry" value={profile.industry || 'N/A'} icon={<Info size={16}/>} />
            <DataPoint label="Sector" value={profile.sector || 'N/A'} icon={<Info size={16}/>} />
          </div>
           {profile.description && (
             <div className="mt-6 border-t border-quantum-border pt-4">
                <h3 className="font-semibold text-quantum-text mb-2">About</h3>
                <p className="text-sm text-quantum-text-muted leading-relaxed">{profile.description.substring(0, 280)}...</p>
             </div>
           )}
        </motion.div>
      </div>
    </div>
  );
};

export default AssetDetailPage;