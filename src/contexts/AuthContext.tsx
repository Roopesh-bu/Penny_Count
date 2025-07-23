import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { dataService } from '../services/dataService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  sendOTP: (phone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('penny-count-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Convert createdAt string back to Date object
        if (parsedUser.createdAt) {
          parsedUser.createdAt = new Date(parsedUser.createdAt);
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('penny-count-user');
      }
    }
    setIsLoading(false);
  }, []);

  const sendOTP = async (phone: string): Promise<boolean> => {
    // Mock OTP sending - in real app, this would call your backend API
    console.log(`Sending OTP to ${phone}`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    // Mock OTP verification
    if (otp === '123456') {
      try {
        const users = await dataService.getUsers();
        const foundUser = users.find(u => u.phone === phone && u.isActive);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('penny-count-user', JSON.stringify(foundUser));
          return true;
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('penny-count-user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, sendOTP }}>
      {children}
    </AuthContext.Provider>
  );
};