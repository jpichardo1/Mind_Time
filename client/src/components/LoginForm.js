import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from './AuthContext';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setMessage('Login successful!');
        login(username);
        history.push('/');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Login failed');
      }
    } catch (error) {
      setMessage('An error occurred');
      console.error('Fetch error:', error);
    }
  }
  

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default LoginForm;
