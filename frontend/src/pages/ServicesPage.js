import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// This array now only contains the essential information for each card.
const services = [
  {
    name: 'Xerox & Printing',
    description: 'Upload your documents for fast and reliable printing.',
    path: '/dashboard',
  },
  {
    name: 'Stationary',
    description: 'Get notebooks, pens, and other essential supplies.',
    path: '/stationary',
  },
  {
    name: 'Snacks & Drinks',
    description: 'Order snacks and beverages delivered to your location.',
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
      <div className="services-grid">
        {services.map((service, index) => (
          <Link to={service.path} key={index} className="service-card-link">
            {/* The inline style for background-image has been removed from this div */}
            <motion.div
              className="service-card"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* The overlay div has been removed for a cleaner look */}
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

