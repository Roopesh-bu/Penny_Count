import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { supabaseService } from '../services/supabaseService';
import { supabase } from '../lib/supabase';

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

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already logged in with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user details from our users table
          const users = await supabaseService.getUsers();
          const currentUser = users.find(u => u.phone === session.user.phone);
          
          if (currentUser) {
            setUser(currentUser);
          }
        } else {
          // Fallback to localStorage for demo purposes
          const storedUser = localStorage.getItem('penny-count-user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser.createdAt) {
                parsedUser.createdAt = new Date(parsedUser.createdAt);
              }
              setUser(parsedUser);
            } catch (error) {
              console.error('Error parsing stored user:', error);
              localStorage.removeItem('penny-count-user');
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const users = await supabaseService.getUsers();
        const currentUser = users.find(u => u.phone === session.user.phone);
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem('penny-count-user', JSON.stringify(currentUser));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('penny-count-user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      // Use Supabase Auth to send OTP
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          channel: 'sms'
        }
      });
      
      if (error) {
        console.error('Error sending OTP:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Fallback for demo - always return true
      return true;
    }
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    try {
      // Try Supabase OTP verification first
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp,
        type: 'sms'
      });
      
      if (!error && data.user) {
        // Get user from our database
        const users = await supabaseService.getUsers();
        const foundUser = users.find(u => u.phone === phone && u.isActive);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('penny-count-user', JSON.stringify(foundUser));
          return true;
        }
      }
      
      // Fallback for demo purposes
      if (otp === '123456') {
        try {
          const users = await supabaseService.getUsers();
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
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    // Sign out from Supabase
    supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('penny-count-user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, sendOTP }}>
      {children}
    </AuthContext.Provider>
  );
};