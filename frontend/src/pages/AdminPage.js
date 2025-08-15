import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import axios from 'axios';

const AdminPage = () => {
    const [orders, setOrders] = useState([]);
    const user = JSON.parse(localStorage.getItem('profile'));

    // We use useCallback to prevent the fetchAllOrders function from being recreated on every render
    const fetchAllOrders = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setOrders(data);
        } catch (error) {
            console.error("Could not fetch orders", error);
            alert("You are not authorized to view this page.");
        }
    }, [user.token]); // Dependency array for useCallback

    useEffect(() => {
        // Now we can safely call fetchAllOrders from inside the effect
        fetchAllOrders();
    }, [fetchAllOrders]); // Add the memoized function to the dependency array

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, 
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            );
            // After updating, we re-fetch the orders to get the latest list
            fetchAllOrders();
            alert("Status updated!");
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Error updating status.");
        }
    };

    const statusOptions = ['Paid', 'In Progress', 'Delivered'];

    return (
        <div className="order-history">
            <h3>Admin Panel - All Customer Orders 📮</h3>
            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>File Name</th>
                        <th>Location & Contact</th>
                        <th>Amount Paid</th>
                        <th>Order Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <tr key={order._id}>
                                <td>{order.user?.name || 'N/A'}<br/><small>{order.user?.email}</small></td>
                                <td>{order.fileName}</td>
                                <td>{order.location}<br/><small>{order.contactNo}</small></td>
                                <td><strong>₹{order.amount}</strong><br/><small>{order.status === 'Paid' ? '✅ Received' : '⏳ Pending'}</small></td>
                                <td>
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="status-select"
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>No orders found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;