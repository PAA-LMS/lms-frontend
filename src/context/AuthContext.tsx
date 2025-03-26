import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authAPI, usersAPI } from '../services/api';

// Define user types based on backend models
type UserProfile = {
  id: number;
  user_id: number;
  department?: string;
  bio?: string;
  qualification?: string;
  enrollment_number?: string;
  semester?: number;
  program?: string;
  created_at: string;
  updated_at: string;
};

type User = {
  id: number;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  role: 'lecturer' | 'student' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  lecturer_profile?: UserProfile;
  student_profile?: UserProfile;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLecturer: boolean;
  isStudent: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if there's a user in local storage on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Get user data from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      // Get token from backend
      const response = await authAPI.login(username, password);
      localStorage.setItem('token', response.access_token);
      
      try {
        // Try to get actual user data from backend
        const userData = await usersAPI.getAllUsers();
        // Find the logged-in user by username
        const loggedInUser = userData.find((u: User) => u.username === username);
        
        if (loggedInUser) {
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          setUser(loggedInUser);
          return loggedInUser;
        }
      } catch (userDataError) {
        console.error('Error fetching user data:', userDataError);
      }
      
      // Fallback if we can't get user data from backend
      const dummyUser = {
        id: 1,
        username,
        email: `${username}@example.com`,
        first_name: '',
        last_name: '',
        // Check if it's one of our test accounts with predefined roles
        role: (username === 'lecturer') ? 'lecturer' : 
              (username === 'student') ? 'student' : 
              (username === 'admin') ? 'admin' :
              'student', // Default to student if unknown
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as User;
      
      localStorage.setItem('user', JSON.stringify(dummyUser));
      setUser(dummyUser);
      return dummyUser;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.register(userData);
      // After registration, you might want to log the user in automatically
      // or redirect to login page
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;
  const isLecturer = user?.role === 'lecturer';
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAuthenticated,
    isLecturer,
    isStudent,
    isAdmin,
    loading,
    error,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 