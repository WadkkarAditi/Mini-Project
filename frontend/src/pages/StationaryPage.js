import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const StationaryPage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/stationary');
        setItems(data);
        setIsLoading(false);
      } catch (error) { // The typo has been fixed here
        console.error("Failed to fetch stationary items", error);
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const addToCart = (item) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem._id === item._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${item.name} has been added to your cart!`);
  };

  if (isLoading) {
    return <h2 style={{ textAlign: 'center', marginTop: '5rem' }}>Loading stationary...</h2>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="header">
        <h2>Stationary</h2>
      </div>
      <div className="product-grid">
        {items.map((item, index) => (
          <motion.div
            key={item._id}
            className="product-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="product-card-content">
              <h3>{item.name}</h3>
              <p className="product-description">{item.description}</p>
              <div className="product-footer">
                <span className="product-price">₹{item.price}</span>
                <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StationaryPage;