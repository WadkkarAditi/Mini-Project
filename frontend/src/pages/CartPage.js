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

    // This useEffect hook runs once when the page loads to get cart data
    useEffect(() => {
        updateCart();
    }, []);

    // Function to get latest cart data from local storage and update state
    const updateCart = () => {
        const items = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(items);
        const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(cartTotal);
    };

    // Function to remove an item from the cart
    const removeFromCart = (itemId) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item._id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart(); // Re-render the component with the new cart data
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return alert("Your cart is empty!");

        try {
            // 1. Create the product order in the database
            const { data: createdOrder } = await axios.post('http://localhost:5000/api/orders/place-product-order', {
                items: cartItems,
                location: details.location,
                contactNo: details.contactNo,
            }, { headers: { 'Authorization': `Bearer ${user.token}` } });
            
            // 2. Initiate the real payment process
            handleRealPayment(createdOrder);
        } catch (error) {
            alert("Error during checkout. Check console for details.");
            console.error("Checkout failed:", error.response || error);
        }
    };

    const handleRealPayment = async (order) => {
        try {
            const { data: razorpayOrder } = await axios.post('http://localhost:5000/api/payment/create-order', 
                { orderId: order._id }, 
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            );

            const options = {
                key: 'rzp_test_RFZkH7X0Yho4gZ', // Replace with your key
                amount: razorpayOrder.amount,
                currency: 'INR',
                name: 'PrintJet',
                description: `Payment for Product Order`,
                order_id: razorpayOrder.id,
                handler: async (response) => {
                    await axios.post('http://localhost:5000/api/payment/verify', response, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    alert('Payment Successful!');
                    localStorage.removeItem('cart'); // Clear cart after successful payment
                    navigate('/services');
                },
                prefill: { name: user.result.name, contact: details.contactNo },
                theme: { color: '#e94560' }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', () => alert("Payment Failed. Please try again."));
            rzp1.open();
        } catch (error) {
            alert("Error initiating payment. Check console for details.");
            console.error("Payment initiation failed:", error.response || error);
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
                                <span className="cart-item-price">₹{item.price} each</span>
                            </div>
                            <div className="cart-item-actions">
                                <span>₹{item.price * item.quantity}</span>
                                <button onClick={() => removeFromCart(item._id)} className="remove-item-btn">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-checkout">
                    <h3>Order Summary</h3>
                    <p className="cart-total">Total: ₹{total}</p>
                    <form onSubmit={handleCheckout}>
                        <label>Contact No 📱:</label>
                        <input type="tel" placeholder="10-digit mobile number" value={details.contactNo} onChange={(e) => setDetails({...details, contactNo: e.target.value})} pattern="[0-9]{10}" required />
                        <label>Delivery Location 📍:</label>
                        <select value={details.location} onChange={(e) => setDetails({...details, location: e.target.value})}>
                            {campusLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                        </select>
                        <button type="submit">Proceed to Payment</button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default CartPage;

