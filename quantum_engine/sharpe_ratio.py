import numpy as np
from scipy.stats import norm

def calculate_portfolio_performance(weights_dict, mu, sigma, risk_free_rate=0.02):
    """
    Calculate performance metrics for a given portfolio.
    """
    weights = np.array(list(weights_dict.values()))
    
    # Annualize returns (assuming 252 trading days)
    expected_return = np.sum(mu * weights) * 252
    
    # Annualize volatility
    portfolio_variance = np.dot(weights.T, np.dot(sigma * 252, weights))
    portfolio_volatility = np.sqrt(portfolio_variance)
    
    # Calculate Sharpe Ratio
    sharpe_ratio = (expected_return - risk_free_rate) / portfolio_volatility
    
    return expected_return, portfolio_volatility, sharpe_ratio

def calculate_var(mu, sigma, weights_dict, confidence_level=0.95):
    """
    Calculates the daily Value at Risk (VaR) of a portfolio
    using the variance-covariance method.
    """
    weights = np.array(list(weights_dict.values()))
    
    # Calculate daily portfolio mean and standard deviation
    portfolio_mean = np.sum(mu * weights)
    portfolio_std_dev = np.sqrt(np.dot(weights.T, np.dot(sigma, weights)))
    
    # Calculate the Z-score for the given confidence level
    z_score = norm.ppf(confidence_level)
    
    # Calculate VaR
    var = portfolio_mean - z_score * portfolio_std_dev
    
    # VaR is typically expressed as a positive value
    return abs(var)