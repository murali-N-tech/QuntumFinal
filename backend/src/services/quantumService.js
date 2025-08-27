const axios = require('axios');

const getQuantumOptimization = async (assets) => {
  try {
    const pythonApiUrl = `${process.env.PYTHON_API_URL}/optimize`;
    const response = await axios.post(pythonApiUrl, { assets });
    return response.data;
  } catch (error) {
    console.error('Error calling Python optimization service:', error.message);
    throw new Error('Could not get optimization from quantum service.');
  }
};

const getHistoricalData = async (asset) => {
    try {
        const response = await axios.post(`${process.env.PYTHON_API_URL}/history`, { asset });
        return response.data;
    } catch (error) {
        console.error('Error calling Python history service:', error.message);
        throw new Error('Could not get historical data.');
    }
};

module.exports = {
    getQuantumOptimization,
    getHistoricalData,
};