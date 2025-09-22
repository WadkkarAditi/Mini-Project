import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// SVG icons are defined as components for clean, reusable code
const PrinterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
);
const PenToolIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 22l5-9z"/><path d="m2 2 7.586 7.586"/><path d="m11 11 1 1"/></svg>
);
const SnacksIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11v1a10 10 0 1 1-2.9-7.1"/><path d="M16 16a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M12.5 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M16 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M10 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/></svg>
);

const services = [
  {
    name: 'Xerox & Printing',
    description: 'Upload your documents for fast and reliable printing.',
    icon: <PrinterIcon />,
    path: '/dashboard',
  },
  {
    name: 'Stationary',
    description: 'Get notebooks, pens, and other essential supplies.',
    icon: <PenToolIcon />,
    path: '/stationary',
  },
  {
    name: 'Snacks & Drinks',
    description: 'Order snacks and beverages delivered to your location.',
    icon: <SnacksIcon />,
    path: '/snacks',
  },
];

const ServicesPage = () => {
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="header">
        <h2>Welcome, {user?.result?.name || 'User'}!</h2>
        <p style={{color: 'var(--text-secondary)', fontSize: '1.2rem'}}>What services would you like to use today?</p>
      </div>
      <div className="services-container"> 
        {services.map((service, index) => (
          <Link to={service.path} key={index} className="service-card-link">
            <motion.div
              className="service-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="service-card-icon">{service.icon}</div>
              <div className="service-card-content">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default ServicesPage;

