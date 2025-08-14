
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'Promoteur' | 'DAC' | 'DAF' | 'Secrétaire' | 'Surveillant' | 'Professeur' | 'Étudiant';

interface AuthContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>('Promoteur'); // Default role
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
        const storedRole = localStorage.getItem('userRole') as UserRole;
        if (storedRole) {
            setUserRole(storedRole);
        }
    } catch (error) {
        console.warn("Could not read user role from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  const handleSetUserRole = (role: UserRole) => {
    setUserRole(role);
     try {
        localStorage.setItem('userRole', role);
    } catch (error) {
        console.warn("Could not save user role to localStorage", error);
    }
  };

  if (!isInitialized) {
      return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ userRole, setUserRole: handleSetUserRole }}>
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
