import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Logout() {
  const { logout } = useAuth();
  const history = useHistory();

  useEffect(() => {
    logout();
    history.push('/', { message: 'You have been logged out.' });
  }, [logout, history]);

  return null;
}

export default Logout;
