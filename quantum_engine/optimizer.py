from utils.data_preprocessor import fetch_historical_data
from quantum_models.qaoa_optimizer import optimize_with_qaoa
from quantum_models.classical_optimizer import optimize_with_classical 
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
        
    # 3. Run Classical Optimization
    try:
        classical_weights, classical_result = optimize_with_classical(mu, sigma, budget=len(assets)) 
    except Exception as e:
        raise RuntimeError(f"Classical optimization failed: {e}")

    # 4. Calculate performance metrics for both
    qaoa_expected_return, qaoa_volatility, qaoa_sharpe = calculate_portfolio_performance(qaoa_weights, mu, sigma)
    classical_expected_return, classical_volatility, classical_sharpe = calculate_portfolio_performance(classical_weights, mu, sigma)
    
    # NEW: Calculate Value at Risk (VaR) for both
    qaoa_value_at_risk_95 = calculate_var(mu, sigma, qaoa_weights, confidence_level=0.95)
    classical_value_at_risk_95 = calculate_var(mu, sigma, classical_weights, confidence_level=0.95)

    # 5. Format and return the final result
    formatted_result = {
        "quantum": {
            "provider": "Quantum QAOA Optimizer",
            "assets": assets,
            "optimal_weights": {asset: round(weight, 4) for asset, weight in qaoa_weights.items()},
            "performance": {
                "expected_annual_return": round(qaoa_expected_return, 4),
                "annual_volatility": round(qaoa_volatility, 4),
                "sharpe_ratio": round(qaoa_sharpe, 4),
                "value_at_risk_95": round(qaoa_value_at_risk_95, 4)
            },
            "raw_qaoa_result": str(qaoa_result)
        },
        "classical": {
            "provider": "Classical Mean-Variance Optimizer",
            "assets": assets,
            "optimal_weights": {asset: round(weight, 4) for asset, weight in classical_weights.items()},
            "performance": {
                "expected_annual_return": round(classical_expected_return, 4),
                "annual_volatility": round(classical_volatility, 4),
                "sharpe_ratio": round(classical_sharpe, 4),
                "value_at_risk_95": round(classical_value_at_risk_95, 4)
            },
            "raw_classical_result": str(classical_result)
        }
    }

    return formatted_result