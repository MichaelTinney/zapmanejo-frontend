import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  const login = (token, userObj) => {
    if (token) localStorage.setItem('token', token);
    if (userObj) localStorage.setItem('user', JSON.stringify(userObj));
    api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : undefined;
    setUser(userObj);
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {}
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    // router navigate to login
    navigate('/login');
  };

  useEffect(() => {
    // Listen for the app-level logout event dispatched by axios on 401.
    const handler = () => {
      logout();
    };
    window.addEventListener('app:auth-logout', handler);
    return () => window.removeEventListener('app:auth-logout', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty deps so handler is registered once

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
