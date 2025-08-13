
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'Promoteur' | 'DAC' | 'DAF' | 'Secrétaire' | 'Surveillant' | 'Professeur' | 'Étudiant';

interface AuthContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>('Promoteur'); // Default role

  return (
    <AuthContext.Provider value={{ userRole, setUserRole }}>
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
