import React, { createContext, useContext, useState } from 'react'
import { api } from '../services/api'
import { useToast } from './ToastContext'
import { validateCPF } from '../utils/cpf'

export interface IUserProfile {
    id: number;
    nome: string;
    email: string;
    cpf: string; 
    avatarUrl: string | null;
}

interface IUpdateProfileData {
    nome: string;
    email: string;
    cpf: string;
    senha?: string;
}

interface AuthContextData {
    isAuthenticated: boolean;
    user: IUserProfile | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signOut: () => void;
    updateProfilePicture: (file: File) => Promise<void>;
    removeProfilePicture: () => Promise<void>;
    updateProfile: (data: IUpdateProfileData) => Promise<void>;
    recoverPassword: (email: string, cpf: string, novaSenha: string) => Promise<void>; // <-- Nova
}

const AuthContext = createContext({} as AuthContextData)

interface AuthProviderProps {
    children: React.ReactNode;
}

const AUTH_KEY = '@admin-supermercado:auth'

export function AuthProvider({ children }: AuthProviderProps) {
    const { addToast } = useToast()
    
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

    async function signIn(email: string, pass: string) {
        try {
            const response = await api.post('/login', { email, senha: pass })
            const { user, token } = response.data

            const authData = { user, token, isAuthenticated: true }
            localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
            
            setAuth({ user, isAuthenticated: true })
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            
            addToast({ type: 'success', title: 'Bem-vindo!', description: `Olá, ${user.nome}` })
        } catch (error) {
            addToast({ type: 'error', title: 'Falha no login', description: 'Email ou senha incorretos.' })
            throw error
        }
    }

    function signOut() {
        localStorage.removeItem(AUTH_KEY)
        setAuth({ user: null, isAuthenticated: false })
        addToast({ type: 'info', title: 'Sessão encerrada' })
    }

    async function updateProfilePicture(file: File) {
        if (!auth.user) return

        const formData = new FormData()
        formData.append('avatar', file)

        try {
            const response = await api.post(`/users/${auth.user.id}/avatar`, formData)
            const { avatarUrl } = response.data
            const updatedUser = { ...auth.user, avatarUrl }
            updateLocalUser(updatedUser)
            addToast({ type: 'success', title: 'Sucesso', description: 'Foto de perfil atualizada.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Não foi possível enviar a imagem.' })
        }
    }

    async function removeProfilePicture() {
        if (!auth.user) return
        try {
            const response = await api.delete(`/users/${auth.user.id}/avatar`)
            const updatedUser = { ...auth.user, ...response.data }
            updateLocalUser(updatedUser)
            addToast({ type: 'success', title: 'Sucesso', description: 'Foto de perfil removida.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Não foi possível remover a imagem.' })
        }
    }

    async function updateProfile(data: IUpdateProfileData) {
        if (!auth.user) return
        if (!validateCPF(data.cpf)) {
            addToast({ type: 'error', title: 'CPF Inválido', description: 'Por favor, verifique os dígitos.' })
            throw new Error('CPF Inválido')
        }
        try {
            const response = await api.put(`/users/${auth.user.id}`, data)
            const updatedUser = { ...auth.user, ...response.data }
            updateLocalUser(updatedUser)
            addToast({ type: 'success', title: 'Perfil Atualizado', description: 'Os seus dados foram alterados.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Não foi possível atualizar o perfil.' })
            throw error
        }
    }

    async function recoverPassword(email: string, cpf: string, novaSenha: string) {
        if (!validateCPF(cpf)) {
            addToast({ type: 'error', title: 'CPF Inválido', description: 'Verifique o CPF digitado.' })
            throw new Error('CPF Inválido')
        }

        try {
            await api.post('/recover-password', { email, cpf, novaSenha })
            addToast({ type: 'success', title: 'Senha Redefinida', description: 'Agora você pode fazer login com a nova senha.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Falha ao Redefinir', description: 'Email ou CPF não conferem.' })
            throw error
        }
    }


    function updateLocalUser(user: IUserProfile) {
        const currentStorage = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}')
        const newAuthData = { ...currentStorage, user }
        localStorage.setItem(AUTH_KEY, JSON.stringify(newAuthData))
        setAuth((prev) => ({ ...prev, user }))
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: auth.isAuthenticated,
                user: auth.user,
                signIn,
                signOut,
                updateProfilePicture,
                removeProfilePicture,
                updateProfile,
                recoverPassword, 
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}