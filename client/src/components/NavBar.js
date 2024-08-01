import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../NavBar.css'; 
import logo from '../assets/Mind_Time.png';

function NavBar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav>
      <img src={logo} alt="Mind_Time" className="logo" />
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
