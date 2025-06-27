import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
    isLoggedIn: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const hasLoggedIn = await AsyncStorage.getItem('hasLoggedIn');
                setIsLoggedIn(hasLoggedIn === 'true');
            } catch (e) {
                console.error("Falha ao verificar o status de login", e);
            } finally {
                setIsLoading(false);
            }
        };
        checkLoginStatus();
    }, []);

    const login = async () => {
        try {
            await AsyncStorage.setItem('hasLoggedIn', 'true');
            setIsLoggedIn(true);
            // A NAVEGAÇÃO FOI REMOVIDA DAQUI
        } catch (e) {
            console.error("Failed to save login status", e);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('hasLoggedIn');
            setIsLoggedIn(false);
            // A NAVEGAÇÃO FOI REMOVIDA DAQUI
        } catch (e) {
            console.error("Failed to remove login status", e);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, isLoading }}>
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