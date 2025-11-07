import React, { createContext, useContext, useState } from 'react'

interface IUserProfile {
    nome: string;
    email: string;
    avatarUrl: string | null;
}

interface AuthContextData {
    isAuthenticated: boolean;
    user: IUserProfile | null;
    signIn: () => void;
    signOut: () => void;
    updateProfilePicture: (base64Image: string) => void;
}

const AuthContext = createContext({} as AuthContextData)

interface AuthProviderProps {
    children: React.ReactNode;
}

const AUTH_KEY = '@admin-supermercado:auth'

export function AuthProvider({ children }: AuthProviderProps) {
    const [auth, setAuth] = useState<{
        user: IUserProfile | null
        isAuthenticated: boolean
    }>(() => {
        const storedAuth = localStorage.getItem(AUTH_KEY)
        if (storedAuth) {
            return JSON.parse(storedAuth)
        }
        return { user: null, isAuthenticated: false }
    })

    function signIn() {
        const mockUser: IUserProfile = {
            nome: 'Admin',
            email: 'admin@mercado.com',
            avatarUrl: null,
        }

        const authData = { user: mockUser, isAuthenticated: true }
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
        setAuth(authData)
    }

    function signOut() {
        localStorage.removeItem(AUTH_KEY)
        setAuth({ user: null, isAuthenticated: false })
    }

    function updateProfilePicture(base64Image: string) {
        if (!auth.user) return

        const updatedUser: IUserProfile = {
            ...auth.user,
            avatarUrl: base64Image,
        }

        const authData = { user: updatedUser, isAuthenticated: true }
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
        setAuth(authData)
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: auth.isAuthenticated,
                user: auth.user,
                signIn,
                signOut,
                updateProfilePicture,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    return context
}
