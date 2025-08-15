import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // --- CORRECTED SIMULATED LOGIN ---
    // 1. Look up the user by email in localStorage
    const savedUser = JSON.parse(localStorage.getItem(email));

    if (!savedUser) {
      alert('No user found with this email. Please register first.');
      return;
    }

    // 2. Create the profile object with the correct name
    const profileData = {
      result: { name: savedUser.name },
      token: 'fake-jwt-token-12345'
    };

    // 3. Save the correct profile to be used by the dashboard
    localStorage.setItem('profile', JSON.stringify(profileData));

    // 4. Navigate to the dashboard
    navigate('/dashboard');
    window.location.reload();
  };

  return (
    <div className="form-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Create one</Link></p>
    </div>
  );
};

export default LoginPage;