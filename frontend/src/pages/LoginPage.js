import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('profile', JSON.stringify(data));
      console.log(data.result)
      if (data.role == "admin") {
        window.location.href = '/admin';

      } else {

        window.location.href = '/services';
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/google-login', {
        token: credentialResponse.credential
      });
      localStorage.setItem('profile', JSON.stringify(data));
      console.log(data.result)
      window.location.href = '/services';
    } catch (error) {
      console.error("Google Login Failed", error);
    }
  };

  return (
    <div className="login-form">
      <h3>Login to Your Account</h3>
      <form onSubmit={handleSubmit}>
        <label>Email Address:</label>
        <input type="email" name="email" placeholder="your.email@example.com" onChange={handleChange} required />
        <label>Password:</label>
        <input type="password" name="password" placeholder="Enter your password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      <div style={{ textAlign: 'center', margin: '1.5rem 0', color: 'var(--text-secondary)' }}>OR</div>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log('Login Failed')}
        theme="filled_blue"
        text="signin_with"
        shape="pill"
      />
    </div>
  );
};

export default LoginPage;