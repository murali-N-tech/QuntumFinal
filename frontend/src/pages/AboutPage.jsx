// src/pages/AboutPage.jsx

import React from 'react';

const teamMembers = [
  {
    name: 'Priya Sharma',
    regNo: '2021A0123',
    phone: '+91 9876543210',
    email: 'priya.sharma@example.com',
    avatar: '/images/team/ghibli_girl_1.png', // Replace with actual filename
    role: '',
  },
  {
    name: 'Anjali Verma',
    regNo: '2021B0456',
    phone: '+91 8765432109',
    email: 'anjali.verma@example.com',
    avatar: '/images/team/ghibli_girl_2.png', // Replace with actual filename
    role: '',
  },
  {
    name: 'Sneha Reddy',
    regNo: '2022C0789',
    phone: '+91 7654321098',
    email: 'sneha.reddy@example.com',
    avatar: '/images/team/ghibli_girl_3.png', // Replace with actual filename
    role: '',
  },
  {
    name: 'Rahul Verma (Team Leader)',
    regNo: '2020X0987',
    phone: '+91 9988776655',
    email: 'rahul.verma@example.com',
    avatar: '/images/team/ghibli_boy_glasses.png', // Replace with actual filename
    role: 'Team Leader',
  },
  {
    name: 'Aryan Singh',
    regNo: '2022Y0654',
    phone: '+91 8899776655',
    email: 'aryan.singh@example.com',
    avatar: '/images/team/ghibli_boy_1.png', // Replace with actual filename
    role: '',
  },
  {
    name: 'Karan Patel',
    regNo: '2021Z0321',
    phone: '+91 7788996655',
    email: 'karan.patel@example.com',
    avatar: '/images/team/ghibli_boy_2.png', // Replace with actual filename
    role: '',
  },
];

const AboutPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 text-gray-300">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8 text-white drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">
        Meet Our StackZy Partners
      </h1>
      <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
        Our diverse team, based in Vijayawada, Andhra Pradesh, India, brings together expertise in quantum computing, finance, and software development to power the Portfolio Optimizer.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-pink-500 transition-colors duration-300 text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-2 border-pink-400">
              <img src={member.avatar} alt={member.name} className="object-cover w-full h-full" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
            {member.role && <p className="text-pink-400 font-medium mb-2">{member.role}</p>}
            <p className="text-sm text-gray-400 mb-1">Reg No: {member.regNo}</p>
            <p className="text-sm text-gray-400 mb-1">Phone: {member.phone}</p>
            <p className="text-sm text-gray-400">Email: {member.email}</p>
            {/* Add any other relevant details here */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;