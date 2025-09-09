import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ServicesPage from './pages/ServicesPage';
import SnacksPage from './pages/SnacksPage';
import StationaryPage from './pages/StationaryPage';
import CartPage from './pages/CartPage';
import './App.css';

const AppRoutes = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('profile'));

  const pageVariants = { /* ... animation code ... */ };
  const pageTransition = { /* ... animation code ... */ };
  
  const AnimatedPage = ({ children }) => (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      {children}
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage>{!user ? <LoginPage /> : <Navigate to="/services" />}</AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage>{!user ? <LoginPage /> : <Navigate to="/services" />}</AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage>{!user ? <RegisterPage /> : <Navigate to="/services" />}</AnimatedPage>} />
        <Route path="/services" element={<AnimatedPage>{user ? <ServicesPage /> : <Navigate to="/login" />}</AnimatedPage>} />
        <Route path="/dashboard" element={<AnimatedPage>{user ? <DashboardPage /> : <Navigate to="/login" />}</AnimatedPage>} />
        <Route path="/stationary" element={<AnimatedPage>{user ? <StationaryPage /> : <Navigate to="/login" />}</AnimatedPage>} />
        <Route path="/snacks" element={<AnimatedPage>{user ? <SnacksPage /> : <Navigate to="/login" />}</AnimatedPage>} />
        <Route path="/cart" element={<AnimatedPage>{user ? <CartPage /> : <Navigate to="/login" />}</AnimatedPage>} />
        <Route path="/admin" element={<AnimatedPage>{user?.result?.role === 'admin' ? <AdminPage /> : <Navigate to="/login" />}</AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const user = JSON.parse(localStorage.getItem('profile'));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="container">
        <nav className="main-nav">
          <Link to={user ? "/services" : "/"} className="logo">PrintJet</Link>
          <div className="nav-links-container">
            {!user ? (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            ) : (
              <div className="nav-user-actions"> {/* This is the new container */}
                {user?.result?.role === 'admin' && (
                  <Link to="/admin" className="nav-link">Admin Panel</Link>
                )}
                <Link to="/cart" className="nav-link">Cart🛒</Link>
                <button onClick={handleLogout} className="logout-btn nav-link">Logout</button>
              </div>
            )}
          </div>
        </nav>
        <main>
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
