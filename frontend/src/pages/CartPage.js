import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [details, setDetails] = useState({ location: 'MIT Library', contactNo: '' });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));

    // A function to update both state and localStorage from the cart
    const updateCart = (newCart) => {
        setCartItems(newCart);
        const cartTotal = newCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(cartTotal);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cart')) || [];
        updateCart(items);
    }, []);

    // --- NEW: Function to remove an item from the cart ---
    const removeFromCart = (itemId) => {
        const updatedCart = cartItems.filter(item => item._id !== itemId);
        updateCart(updatedCart);
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/orders/place-product-order', {
                items: cartItems,
                location: details.location,
                contactNo: details.contactNo,
            }, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            alert('Payment Successful! Your order has been placed.');
            localStorage.removeItem('cart');
            navigate('/services');
        } catch (error) {
            console.error("Checkout failed", error);
            alert("An error occurred during checkout.");
        }
    };

    const campusLocations = [ "MIT Globe", "MIT Library", "MIT Main Gate", "MIT Back Gate", "Vyas Building", "Ganga Building", "Atri Building", "Dhruv Building", "Chanakya Building", "Gargi Building", "Vivekanand Hall" ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="header"><h2>Your Shopping Cart 🛒</h2></div>
            <div className="cart-container">
                <div className="cart-items">
                    {cartItems.length === 0 ? <p>Your cart is empty.</p> : cartItems.map(item => (
                        <div key={item._id} className="cart-item">
                            <div className="cart-item-details">
                                <span>{item.name} (x{item.quantity})</span>
                                <span className="cart-item-price">₹{item.price * item.quantity}</span>
                            </div>
                            {/* --- NEW: Remove button added here --- */}
                            <button className="remove-item-btn" onClick={() => removeFromCart(item._id)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="cart-checkout">
                    <h3>Order Summary</h3>
                    <p className="cart-total">Total: ₹{total}</p>
                    <form onSubmit={handleCheckout}>
                        <label>Contact No 📱:</label>
                        <input type="tel" placeholder="Your 10-digit mobile number" value={details.contactNo} onChange={(e) => setDetails({...details, contactNo: e.target.value})} pattern="[0-9]{10}" required />
                        <label>Delivery Location 📍:</label>
                        <select value={details.location} onChange={(e) => setDetails({...details, location: e.target.value})}>
                            {campusLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                        <button type="submit">Pay & Place Order</button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default CartPage;
