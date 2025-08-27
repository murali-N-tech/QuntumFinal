import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';

// Corrected and updated team member information
const teamMembers = [
  {
    name: 'MURALI',
    regNo: '23B91A5435',
    phone: '+91 9063453458',
    email: 'muralinaga826@gmail.com',
    avatar: 'https://i.pravatar.cc/150?u=murali', // Using a unique placeholder
  },
  {
    name: 'KIRAN KUMAR',
    regNo: '23B91A5457',
    phone: '+91 7993282746',
    email: 'gottakirankumar@gmail.com',
    avatar: 'https://i.pravatar.cc/150?u=kiran', // Using a unique placeholder
  },
  {
    name: 'MANU SAVIOUR',
    regNo: '23B91A5456',
    phone: '+91 6305748682',
    email: 'manusaviour5@gmail.com',
    avatar: 'https://i.pravatar.cc/150?u=manu', // Using a unique placeholder
  },
  {
    name: 'CHARITHA',
    regNo: '23B91A5441',
    phone: '+91 9963407459',
    email: 'saicharitha483@gmail.com',
    avatar: 'https://i.pravatar.cc/150?u=charitha', // Using a unique placeholder
  },
  {
    name: 'NIKITHA',
    regNo: '23B91A5420',
    phone: '+91 8919997426',
    email: 'nikkithabodda@gmail.com',
    avatar: 'https://i.pravatar.cc/150?u=nikitha', // Using a unique placeholder
  },
  {
    name: 'SHARMILA',
    regNo: '23B91A5446',
    phone: '+91 8247726057',
    email: 'sharmiladoddipatla@gmail.com',
    avatar: 'https://i.pravatar.cc/150?u=sharmila', // Using a unique placeholder
  },
];

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-quantum-text text-center glow-text">
          Meet Our StackZy Partners
        </h1>
        <p className="text-quantum-text-muted mb-12 text-center max-w-3xl mx-auto">
          Based in Vijayawada, Andhra Pradesh, India, our team combines expertise in quantum computing, finance, and software development to bring QuantumFolio to life.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="quantum-card text-center p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(67, 206, 162, 0.1)' }}
          >
            <img 
              src={member.avatar} 
              alt={member.name} 
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-quantum-accent" 
              // Fallback in case the placeholder image fails
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/150x150/0D1117/E6F1FF?text=??'; }}
            />
            <h3 className="text-xl font-bold text-quantum-text">{member.name}</h3>
            {member.role && <p className="text-quantum-accent font-medium mb-2">{member.role}</p>}
            <p className="text-sm text-quantum-text-muted mb-4">Reg No: {member.regNo}</p>
            <div className="flex justify-center space-x-4 text-quantum-text-muted">
                <a href={`tel:${member.phone}`} className="hover:text-quantum-accent transition-colors" aria-label={`Call ${member.name}`}>
                  <Phone size={18} />
                </a>
                <a href={`mailto:${member.email}`} className="hover:text-quantum-accent transition-colors" aria-label={`Email ${member.name}`}>
                  <Mail size={18} />
                </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
