import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const SnacksPage = () => {
  const [snacks, setSnacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/snacks');
        setSnacks(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch snacks", error);
        setIsLoading(false);
      }
    };

    fetchSnacks();
  }, []);

  const addToCart = (snack) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item._id === snack._id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...snack, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${snack.name} added to cart!`);
  };

  if (isLoading) {
    return <h2 style={{ textAlign: 'center', marginTop: '5rem' }}>Loading snacks...</h2>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="header">
        <h2>Snacks & Drinks</h2>
      </div>
      <div className="product-grid">
        {snacks.map((snack, index) => (
          <motion.div
            key={snack._id}
            className="product-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* The <img> tag has been removed from here */}
            <div className="product-card-content">
              <h3>{snack.name}</h3>
              <p className="product-description">{snack.description}</p>
              <div className="product-footer">
                <span className="product-price">₹{snack.price}</span>
                <button className="add-to-cart-btn" onClick={() => addToCart(snack)}>Add to Cart</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SnacksPage;