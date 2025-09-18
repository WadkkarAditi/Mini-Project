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
import MyOrdersPage from './pages/MyOrdersPage'; // Import the new page
import './App.css';

const AppRoutes = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('profile'));

  const pageVariants = {
    initial: { opacity: 0, x: -200 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 200 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };
  
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
        <Route path="/my-orders" element={<AnimatedPage>{user ? <MyOrdersPage /> : <Navigate to="/login" />}</AnimatedPage>} /> {/* Add new route */}
        
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
          <div className="nav-user-actions">
            {!user ? (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            ) : (
              <>
                <Link to="/my-orders" className="nav-link">My Orders</Link> {/* Add new link */}
                <Link to="/cart" className="nav-link">Cart 🛒</Link>
                {user?.result?.role === 'admin' && (
                  <Link to="/admin" className="nav-link">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="logout-btn nav-link">Logout</button>
              </>
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

