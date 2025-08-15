import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        // Fetch order details from your backend
        const fetchOrder = async () => {
            try {
                // You will need to create this backend endpoint
                const { data } = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setOrder(data);
            } catch (error) {
                console.log(error);
                alert('Could not fetch order details');
            }
        };
        fetchOrder();
    }, [orderId, user.token]);

    const handlePayment = async () => {
        try {
            // 1. Create a Razorpay Order
            const { data: razorpayOrder } = await axios.post('http://localhost:5000/api/payment/create-order', { orderId }, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            // 2. Open Razorpay Checkout
            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID', // Use your key ID
                amount: razorpayOrder.amount,
                currency: 'INR',
                name: 'PrintJet',
                description: `Payment for Order #${orderId}`,
                order_id: razorpayOrder.id,
                handler: async (response) => {
                    // 3. Verify the payment
                    await axios.post('http://localhost:5000/api/payment/verify', response);
                    alert('Payment Successful!');
                    navigate('/dashboard');
                },
                prefill: {
                    name: user.result.name,
                    // email: user.result.email, // Add email to user profile
                    // contact: order.contactNo
                },
                theme: {
                    color: '#4A90E2'
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.log(error);
            alert('Payment failed. Please try again.');
        }
    };

    if (!order) return <div>Loading...</div>;

    return (
        <div className="form-container">
            <h2>Complete Your Payment 💳</h2>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>File:</strong> {order.fileName}</p>
            <p><strong>Amount to Pay:</strong> ₹{order.amount}</p>
            <button onClick={handlePayment}>Pay Now</button>
        </div>
    );
};

export default PaymentPage;