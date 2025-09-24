import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps {
    isLoggedIn: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn] = useState(true);
    const [isLoading] = useState(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}