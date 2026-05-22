import { useState, useEffect } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('adminToken'));
    };
    
    // Check key updates
    const interval = setInterval(() => {
      const current = localStorage.getItem('adminToken');
      if (current !== token) {
        setToken(current);
      }
    }, 1000);

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [token]);

  return { token };
}
