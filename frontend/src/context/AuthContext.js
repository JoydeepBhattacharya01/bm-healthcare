import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = Cookies.get('token');
    const userData = Cookies.get('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      
      // Save token and user data
      Cookies.set('token', data.token, { expires: 30 });
      Cookies.set('user', JSON.stringify(data), { expires: 30 });
      
      setUser(data);
      toast.success('Registration successful!');
      router.push('/dashboard');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Login user
  const login = async (email, password, skipRedirect = false) => {
    try {
      console.log('[AuthContext] Login attempt:', { email, skipRedirect });
      const { data } = await api.post('/auth/login', { email, password });
      console.log('[AuthContext] Login response:', data);
      
      // Save token and user data
      Cookies.set('token', data.token, { expires: 30 });
      Cookies.set('user', JSON.stringify(data), { expires: 30 });
      console.log('[AuthContext] Cookies set');
      
      setUser(data);
      toast.success('Login successful!');
      
      // Redirect based on role (unless skipRedirect is true)
      if (!skipRedirect) {
        const redirectPath = (data.role === 'admin' || data.role === 'receptionist') 
          ? '/admin/dashboard' 
          : '/dashboard';
        console.log('[AuthContext] Redirecting to:', redirectPath);
        router.push(redirectPath);
      } else {
        console.log('[AuthContext] Skipping redirect');
      }
      
      return { success: true, user: data };
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      console.error('[AuthContext] Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Logout user
  const logout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const { data } = await api.put('/auth/profile', userData);
      
      // Update user data in cookies
      const updatedUser = { ...user, ...data };
      Cookies.set('user', JSON.stringify(updatedUser), { expires: 30 });
      
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isReceptionist: user?.role === 'receptionist',
    isUser: user?.role === 'user',
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
