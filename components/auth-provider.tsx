"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => false,
  signUp: async () => false,
  signOut: () => {},
  loading: true,
});

// In a real app, this would be your backend storage
const USERS_STORAGE_KEY = 'auth_users';
const SESSION_KEY = 'auth_session';

interface StoredUser extends User {
  password: string;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load stored users or initialize with default user
  const getStoredUsers = (): StoredUser[] => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      const defaultUser: StoredUser = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([defaultUser]));
      return [defaultUser];
    }
    return JSON.parse(stored);
  };

  // Initialize session from storage
  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      const sessionUser = JSON.parse(storedSession);
      setUser(sessionUser);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const users = getStoredUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
      toast.success('Signed in successfully');
      return true;
    }
    
    toast.error('Invalid credentials');
    return false;
  };

  const signUp = async (name: string, email: string, password: string) => {
    const users = getStoredUsers();
    
    if (users.some(u => u.email === email)) {
      toast.error('Email already exists');
      return false;
    }

    const newUser: StoredUser = {
      id: String(users.length + 1),
      name,
      email,
      password
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userWithoutPassword));
    
    toast.success('Account created successfully');
    return true;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    toast.success('Signed out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}