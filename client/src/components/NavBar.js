// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

function NavBar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/calendar">Calendar</Link>
      <Link to="/journals">Journals</Link>
      <Link to="/daily">Daily</Link>
      {isLoggedIn ? (
        <>
          <span>Welcome!</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default NavBar;
