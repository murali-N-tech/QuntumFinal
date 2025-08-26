// src/pages/TermsPage.jsx

import React from 'react';

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 text-gray-300">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-white drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]">
        Our Quantum Principles
      </h1>
      <p className="text-center text-gray-400 mb-12">
        Terms of Service & Privacy Policy for the Quantum Portfolio Optimizer
      </p>

      <div className="space-y-10">
        <section>
          <h2 className="text-2xl font-semibold text-purple-300 mb-3">1. The Principle of Superposition (Your Data)</h2>
          <p className="text-gray-400 leading-relaxed">
            Just as a qubit can exist in a superposition of multiple states at once, your personal data is handled with multiple layers of security and privacy. When you provide us with information, it enters a secure, encrypted state. We perform calculations on this data to run optimizations, but it remains anonymized and protected from direct observation. We commit to never "collapsing the wavefunction" to view your individual, private financial data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-300 mb-3">2. The Entanglement Clause (Service Agreement)</h2>
          <p className="text-gray-400 leading-relaxed">
            Your use of our service creates an "entangled" state between your inputs and our optimization outputs. The performance of the quantum-inspired algorithms is directly linked to the accuracy of the asset data you provide. By using this tool, you agree that you are responsible for providing accurate, high-quality data. The insights we provide are for informational purposes, and their entanglement with volatile market conditions means that past performance does not guarantee future results.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-300 mb-3">3. The No-Cloning Theorem (Intellectual Property)</h2>
          <p className="text-gray-400 leading-relaxed">
            In quantum mechanics, the no-cloning theorem states that it is impossible to create an identical copy of an unknown quantum state. Similarly, the proprietary algorithms, models, and quantum-inspired processes (including our QAOA implementation) are the exclusive intellectual property of StackZy Ltd. You are forbidden from attempting to copy, reverse-engineer, or create a derivative "clone" of our service. The specific portfolio optimizations you generate are yours to use.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-300 mb-3">4. Quantum Tunneling (Limitation of Liability)</h2>
          <p className="text-gray-400 leading-relaxed">
            Quantum tunneling is a phenomenon where a particle tunnels through a barrier that it classically could not surmount. Financial markets can experience similarly unpredictable events. While our optimizer calculates portfolio allocations based on high probabilities of success, we are not liable for sudden, unforeseen market events ("tunneling events") that defy classical predictions. All investments carry inherent risks.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-300 mb-3">5. Data Measurement & Privacy</h2>
          <p className="text-gray-400 leading-relaxed">
            The act of measuring a quantum system can alter it. We apply this principle to your privacy. We only "measure" or collect the absolute minimum data necessary for the service to function, such as anonymized usage data to improve our quantum models and session information. We do not track personal information across other sites. Your state is your own.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;