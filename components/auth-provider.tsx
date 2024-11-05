"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';

const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const SIGN_IN = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const GET_ME = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { refetch } = useQuery(GET_ME, {
    skip: typeof window === 'undefined',
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
      }
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  const [signUpMutation] = useMutation(SIGN_UP);
  const [signInMutation] = useMutation(SIGN_IN);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      refetch();
    } else {
      setLoading(false);
    }
  }, [refetch]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await signInMutation({
        variables: {
          input: { email, password },
        },
      });

      if (data.signIn.token) {
        localStorage.setItem('auth_token', data.signIn.token);
        setUser(data.signIn.user);
        toast.success('Signed in successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Invalid credentials');
      return false;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const { data } = await signUpMutation({
        variables: {
          input: { name, email, password },
        },
      });

      if (data.signUp.token) {
        localStorage.setItem('auth_token', data.signUp.token);
        setUser(data.signUp.user);
        toast.success('Account created successfully');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Failed to create account');
      return false;
    }
  };

  const signOut = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    toast.success('Signed out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}