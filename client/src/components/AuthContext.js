import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if the user is already logged in (based on localStorage data)
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const login = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
