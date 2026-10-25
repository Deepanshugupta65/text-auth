
import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './authContext';
import { loginUser, logoutUser } from '../api/authApi';

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(sessionStorage.getItem('access_token'))
  );

  // Handle expired or invalid JWT token
  useEffect(() => {
    const handleExpiredSession = () => {
      sessionStorage.removeItem('access_token');
      setIsAuthenticated(false);
    };

    window.addEventListener('auth:expired', handleExpiredSession);

    return () => {
      window.removeEventListener('auth:expired', handleExpiredSession);
    };
  }, []);

  const login = async (credentials: {
    email: string;
    password: string;
  }) => {
    const response = await loginUser(credentials);

    sessionStorage.setItem(
      'access_token',
      response.access_token
    );

    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      sessionStorage.removeItem('access_token');
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
