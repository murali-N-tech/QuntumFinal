import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ title, children, delay }) => (
  <motion.section 
    className="quantum-card p-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <h2 className="text-2xl font-semibold text-quantum-accent mb-3">{title}</h2>
    <p className="text-quantum-text-muted leading-relaxed">
      {children}
    </p>
  </motion.section>
);

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-white glow-text">
          Our Quantum Principles
        </h1>
        <p className="text-center text-quantum-text-muted mb-12">
          Terms of Service & Privacy Policy for the QuantumFolio Optimizer
        </p>
      </motion.div>

      <div className="space-y-8">
        <Section title="1. The Principle of Superposition (Your Data)" delay={0.2}>
          Just as a qubit can exist in multiple states at once, your personal data is handled with multiple layers of security. We use your inputs for calculation but keep it anonymized and protected. We commit to never "collapsing the wavefunction" to view your private financial data.
        </Section>
        <Section title="2. The Entanglement Clause (Service Agreement)" delay={0.3}>
          Your use of our service creates an "entangled" state between your inputs and our outputs. The performance of the algorithms is linked to the asset data provided. Past performance does not guarantee future results in volatile market conditions.
        </Section>
        <Section title="3. The No-Cloning Theorem (Intellectual Property)" delay={0.4}>
          The quantum no-cloning theorem states it is impossible to copy an unknown quantum state. Similarly, our proprietary algorithms and models are our exclusive intellectual property. You may not copy, reverse-engineer, or "clone" our service.
        </Section>
        <Section title="4. Quantum Tunneling (Limitation of Liability)" delay={0.5}>
          Financial markets can experience unpredictable "tunneling events". While our optimizer calculates probabilities of success, we are not liable for sudden, unforeseen market events that defy classical predictions. All investments carry inherent risks.
        </Section>
      </div>
    </div>
  );
};

export default TermsPage;