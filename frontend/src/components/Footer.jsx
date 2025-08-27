import React from 'react';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-quantum-primary border-t border-quantum-border mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-bold text-quantum-accent mb-4">QuantumFolio</h3>
            <p className="text-quantum-text-muted">
              Leveraging quantum-inspired algorithms to provide cutting-edge portfolio optimization and financial insights.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-quantum-accent mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-quantum-text-muted hover:text-quantum-accent transition-colors">About Us</Link></li>
              <li><Link to="/support" className="text-quantum-text-muted hover:text-quantum-accent transition-colors">Support</Link></li>
              <li><Link to="/terms" className="text-quantum-text-muted hover:text-quantum-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-quantum-accent mb-4">Disclaimer</h3>
            <p className="text-sm text-quantum-text-muted">
              This tool is for informational purposes only and should not be considered financial advice. All investments carry risk.
            </p>
          </div>
        </div>
        <div className="text-center text-quantum-text-muted mt-8 pt-6 border-t border-quantum-border">
          <p>&copy; {new Date().getFullYear()} QuantumFolio by StackZy. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;