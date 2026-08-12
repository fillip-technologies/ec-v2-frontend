'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserPermissions {
  id: number;
  email: string;
  role: string | { id: number; name: string };
  firstName?: string;
  lastName?: string;
  permissions?: string[];
}

export function getUserRoleName(role: any): string {
  if (!role) return 'guest';
  if (typeof role === 'string') return role.toLowerCase();
  if (typeof role === 'object' && role.name) return String(role.name).toLowerCase();
  return 'guest';
}

interface AuthContextType {
  user: UserPermissions | null;
  setUser: React.Dispatch<React.SetStateAction<UserPermissions | null>>;
  hasPermission: (permissionSlug: string) => boolean;
  hasRole: (roles: string | string[]) => boolean;
  roleName: string;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPermissions | null>(null);

  useEffect(() => {
    // Read user session from localStorage or API response if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const roleName = getUserRoleName(user?.role);

  const hasPermission = (permissionSlug: string): boolean => {
    if (!user) return false;
    if (roleName === 'super_admin') return true;
    return user.permissions?.includes(permissionSlug) ?? false;
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.map((r) => r.toLowerCase()).includes(roleName);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeRole');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, hasPermission, hasRole, roleName, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
