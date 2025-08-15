import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage'; // Make sure this is imported
import './App.css';

function App() {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <Router>
      <div className="container">
        <nav className="main-nav">
          <Link to="/" className="logo">PrintJet</Link>
          
          {/* This div will contain all the navigation links */}
          <div>
            {!user ? (
              // If no user is logged in, show Login and Register links
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            ) : (
              // If a user is logged in, show the Dashboard link
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            )}

            {/* --- ADMIN LINK LOGIC --- */}
            {/* Only show the Admin Panel link if the user's role is 'admin' */}
            {user?.result?.role === 'admin' && (
              <Link to="/admin" className="nav-link">Admin Panel</Link>
            )}
          </div>
        </nav>

        <main>
          <Routes>
            {/* Standard user routes */}
            <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
            
            {/* --- PROTECTED ADMIN ROUTE --- */}
            {/* Only allow access to the /admin route if the user's role is 'admin' */}
            <Route 
              path="/admin" 
              element={user?.result?.role === 'admin' ? <AdminPage /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;