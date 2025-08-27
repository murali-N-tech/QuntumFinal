from utils.data_preprocessor import fetch_historical_data
from quantum_models.qaoa_optimizer import optimize_with_qaoa
from sharpe_ratio import calculate_portfolio_performance, calculate_var

def run_optimization(assets):
    """
    Main function to run the entire optimization pipeline.
    """
    # 1. Fetch and preprocess data
    try:
        data = fetch_historical_data(assets)
        mu = data.pct_change().mean()
        sigma = data.pct_change().cov()
    except Exception as e:
        raise ConnectionError(f"Failed to fetch market data: {e}")

    # 2. Run Quantum Optimization (QAOA)
    try:
        qaoa_weights, qaoa_result = optimize_with_qaoa(mu, sigma, q=0.5, budget=len(assets) // 2)
    except Exception as e:
        raise RuntimeError(f"QAOA optimization failed: {e}")
        
    # 3. Calculate performance metrics
    expected_return, volatility, sharpe = calculate_portfolio_performance(qaoa_weights, mu, sigma)
    
    # NEW: Calculate Value at Risk (VaR)
    value_at_risk_95 = calculate_var(mu, sigma, qaoa_weights, confidence_level=0.95)

    # 4. Format and return the final result
    formatted_result = {
        "provider": "Quantum QAOA Optimizer",
        "assets": assets,
        "optimal_weights": {asset: round(weight, 4) for asset, weight in qaoa_weights.items()},
        "performance": {
            "expected_annual_return": round(expected_return, 4),
            "annual_volatility": round(volatility, 4),
            "sharpe_ratio": round(sharpe, 4),
            "value_at_risk_95": round(value_at_risk_95, 4) # Add VaR to the response
        },
        "raw_qaoa_result": str(qaoa_result)
    }

    return formatted_result