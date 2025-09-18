import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.token) {
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const { data } = await axios.get('http://localhost:5000/api/orders/my-orders', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setOrders(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Could not fetch orders", error);
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user?.token]);

    if (isLoading) {
        return <h2 style={{ textAlign: 'center', marginTop: '5rem' }}>Loading your orders...</h2>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="header">
                <h2>My Order History 📜</h2>
            </div>
            <div className="order-history">
                <table>
                    <thead>
                        <tr>
                            <th>Order Details</th>
                            <th>Amount</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order._id}>
                                    <td>
                                        {order.orderType === 'printing' ? (
                                            <span>{order.fileName}</span>
                                        ) : (
                                            <ul className="order-item-list">
                                                {order.items.map((item, index) => (
                                                    <li key={index}>{item.name} (x{item.quantity})</li>
                                                ))}
                                            </ul>
                                        )}
                                    </td>
                                    <td><strong>₹{order.amount}</strong></td>
                                    <td>{order.location}</td>
                                    <td>
                                        <span className={`status ${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>You haven't placed any orders yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default MyOrdersPage;
