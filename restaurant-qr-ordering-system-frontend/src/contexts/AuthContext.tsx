import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, LoginRequest, UserRole } from '../types';
import { authApi } from '../api/auth';
import { localStorageService } from '../services/localStorageService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  isRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorageService.getAccessToken());
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorageService.clearAuth();
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await authApi.getMe();
      setUser(userData);
      localStorageService.setUserSnapshot(JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setIsLoading(false);
    }
  }, [token, fetchMe]);

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const authData = await authApi.login(data);
      const { token: authToken, role, email, firstName, lastName, userId } = authData;
      
      localStorageService.setAccessToken(authToken);
      
      // Construct user object from auth data for immediate use
      const immediateUser: User = {
        userId,
        email,
        role,
        firstName,
        lastName,
        phoneNumber: '', // Not provided in auth response, but we can fill it later
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      setUser(immediateUser);
      localStorageService.setUserSnapshot(JSON.stringify(immediateUser));
      setToken(authToken);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const isRole = (role: UserRole) => user?.role === role;
  
  const hasAnyRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        isRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
