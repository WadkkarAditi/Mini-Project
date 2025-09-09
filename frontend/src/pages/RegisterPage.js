import React, { useState } from 'react';
// We have removed 'useNavigate' from this import statement
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', formData);

      localStorage.setItem('profile', JSON.stringify(data));

      // This line handles the redirect, so useNavigate is not needed.
      window.location.href = '/services';

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-form">
      <h3>Create an Account</h3>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" placeholder="Your Name" onChange={handleChange} required />
        <label>Email Address:</label>
        <input type="email" name="email" placeholder="your.email@example.com" onChange={handleChange} required />
        <label>Password:</label>
        <input type="password" name="password" placeholder="Choose a secure password" onChange={handleChange} required minLength="6" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;