import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const [orders, setOrders] = useState([]);
  const [newOrderData, setNewOrderData] = useState({
    file: null,
    fileName: '',
    pages: '',
    copies: 1,
    color: 'false',
    sided: 'single',
    location: 'MIT Library',
    contactNo: ''
  });
  const campusLocations = [ "MIT Globe", "MIT Library", "MIT Main Gate", "MIT Back Gate", "Vyas Building", "Ganga Building", "Atri Building", "Dhruv Building", "Chanakya Building", "Gargi Building", "Vivekanand Hall" ];

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setOrders(data);
    } catch (error) {
      console.error("Could not fetch orders", error);
    }
  }, [user.token]);

  useEffect(() => {
    if (user?.token) {
      fetchOrders();
    }
  }, [user?.token, fetchOrders]);

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setNewOrderData({ ...newOrderData, file: files[0], fileName: files[0].name });
    } else {
      setNewOrderData({ ...newOrderData, [name]: value });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!newOrderData.file || !newOrderData.pages) return alert("Please select a file and enter the number of pages.");

    try {
      const formData = new FormData();
      formData.append('document', newOrderData.file);
      formData.append('pages', newOrderData.pages);
      formData.append('copies', newOrderData.copies);
      formData.append('color', newOrderData.color);
      formData.append('sided', newOrderData.sided);
      formData.append('location', newOrderData.location);
      formData.append('contactNo', newOrderData.contactNo);

      const { data: createdOrder } = await axios.post('http://localhost:5000/api/orders/create', formData, {
        headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      handleRealPayment(createdOrder);

    } catch (error) {
      console.error("Error placing order:", error.response || error);
      alert('An error occurred. Please try again.');
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
        description: `Payment for ${order.fileName}`,
        order_id: razorpayOrder.id,
        handler: async (response) => {
          await axios.post('http://localhost:5000/api/payment/verify', response, {
             headers: { 'Authorization': `Bearer ${user.token}` }
          });
          alert('Payment Successful!');
          fetchOrders();
        },
        prefill: { name: user.result.name, contact: newOrderData.contactNo },
        theme: { color: '#120104ff' }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', () => alert("Payment Failed. Please try again."));
      rzp1.open();
    } catch (error) {
      alert("Error initiating payment. Check console for details.");
      console.error("Payment initiation failed:", error.response || error);
    }
  };

  const calculateCost = () => {
    if (!newOrderData.pages || !newOrderData.copies) return 0;
    const costPerPage = newOrderData.color === 'true' ? 10 : 4;
    return parseInt(newOrderData.pages) * parseInt(newOrderData.copies) * costPerPage;
  };

  return (
    <div>
      <div className="header">
        <h2>Welcome, {user?.result?.name || 'User'}!</h2>
      </div>
      <motion.div 
        className="upload-form"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h3>Place a New Xerox Order 🚀</h3>
        <form onSubmit={handlePlaceOrder}>
          <label>Select Document:</label>
          <input type="file" name="file" onChange={handleFormChange} required />
          <label>Number of Pages:</label>
          <input type="number" name="pages" placeholder="e.g., 20" min="1" value={newOrderData.pages} onChange={handleFormChange} required />
          <label>Contact No 📱:</label>
          <input type="tel" name="contactNo" placeholder="10-digit mobile number" value={newOrderData.contactNo} onChange={handleFormChange} pattern="[0-9]{10}" required />
          <label>Delivery Location 📍:</label>
          <select name="location" value={newOrderData.location} onChange={handleFormChange}>
            {campusLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <label>Number of Copies:</label>
          <input type="number" name="copies" placeholder="e.g., 1" min="1" value={newOrderData.copies} onChange={handleFormChange} required />
          <label>Print Options:</label>
          <select name="color" value={newOrderData.color} onChange={handleFormChange}>
            <option value="false">Black & White (₹4/page)</option>
            <option value="true">Color (₹10/page)</option>
          </select>
          <div style={{textAlign: 'center', margin: '20px 0', fontSize: '1.5rem', fontWeight: 'bold'}}>
            Estimated Cost: ₹{calculateCost()}
          </div>
          <button type="submit">Proceed to Payment</button>
        </form>
      </motion.div>
      <div className="order-history">
        <h3>Your Order History</h3>
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Location</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order._id}>
                  <td>{order.fileName || 'Product Order'}</td>
                  <td>{order.location}</td>
                  <td>₹{order.amount}</td>
                  <td><span className={`status ${order.status.toLowerCase().replace(/\s/g, '-')}`}>{order.status}</span></td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No orders found yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;

