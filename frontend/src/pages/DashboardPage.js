import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const navigate = useNavigate();
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

  // Fetch user's order history
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        setOrders(data);
      } catch (error) {
        console.error("Could not fetch orders", error);
      }
    };
    if (user?.token) {
      fetchOrders();
    }
  }, [user?.token]);

  const campusLocations = [ "MIT Globe", "MIT Library", "MIT Main Gate", "MIT Back Gate", "Vyas Building", "Ganga Building", "Atri Building", "Dhruv Building", "Chanakya Building", "Gargi Building", "Vivekanand Hall" ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setNewOrderData({ ...newOrderData, file: files[0], fileName: files[0].name });
    } else {
      setNewOrderData({ ...newOrderData, [name]: value });
    }
  };

  // --- DUMMY PAYMENT & ORDER FUNCTION ---
  const handleDummyOrderAndPay = async (e) => {
    e.preventDefault();
    if (!newOrderData.file || !newOrderData.pages) {
      alert("Please select a file and enter the number of pages.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('document', newOrderData.file);
      formData.append('pages', newOrderData.pages);
      formData.append('copies', newOrderData.copies);
      formData.append('color', newOrderData.color);
      formData.append('sided', newOrderData.sided);
      formData.append('location', newOrderData.location);
      formData.append('contactNo', newOrderData.contactNo);

      await axios.post('http://localhost:5000/api/orders/create', formData, {
        headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Payment Successful! Your order has been placed.');

      const { data } = await axios.get('http://localhost:5000/api/orders/my-orders', {
         headers: { 'Authorization': `Bearer ${user.token}` }
      });
      setOrders(data);

    } catch (error) {
      console.error(error);
      alert('An error occurred while placing the order. Please try again.');
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
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <motion.div 
      className="upload-form"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      >
        <h3>Place a New Order & Pay 🚀</h3>
        <form onSubmit={handleDummyOrderAndPay}>
          <label>Select Document:</label>
          <input type="file" name="file" onChange={handleFormChange} required />
          
          <label>Number of Pages in Document:</label>
          <input type="number" name="pages" placeholder="e.g., 20" min="1" value={newOrderData.pages} onChange={handleFormChange} required />

          <label>Contact No 📱:</label>
          <input type="tel" name="contactNo" placeholder="Your 10-digit mobile number" value={newOrderData.contactNo} onChange={handleFormChange} pattern="[0-9]{10}" required />

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

          <button type="submit">Pay & Place Order</button>
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
                  <td>{order.fileName}</td>
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