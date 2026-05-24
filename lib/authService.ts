import { useState, useEffect } from 'react';
import { getStoredAdminToken } from './adminService';

export function useAuth() {
  const [token, setToken] = useState<string | null>(getStoredAdminToken());

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(getStoredAdminToken());
    };

    const interval = setInterval(() => {
      const current = getStoredAdminToken();
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
