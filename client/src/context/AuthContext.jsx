import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('dayflow_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (error) {
          console.warn('Session expired or invalid token:', error.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const signup = async (formData) => {
    setIsLoading(true);
    try {
      const res = await API.post('/auth/signup', formData);
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('dayflow_token', res.data.token);
          setToken(res.data.token);
          setUser(res.data.user);
        }
      }
      setIsLoading(false);
      return res.data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signin = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await API.post('/auth/signin', { email, password });
      if (res.data.success && res.data.token) {
        localStorage.setItem('dayflow_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
      }
      setIsLoading(false);
      return res.data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      if (token) {
        await API.post('/auth/logout');
      }
    } catch (e) {
      // Ignore logout backend errors
    } finally {
      localStorage.removeItem('dayflow_token');
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      const res = await API.get(`/auth/verify-email/${verificationToken}`);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const resendVerification = async (email) => {
    try {
      const res = await API.post('/auth/resend-verification', { email });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await API.post('/auth/forgot-password', { email });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (resetToken, password, confirmPassword) => {
    try {
      const res = await API.post('/auth/reset-password', {
        token: resetToken,
        password,
        confirmPassword,
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(user && token),
    role: user?.role || null,
    signup,
    signin,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
