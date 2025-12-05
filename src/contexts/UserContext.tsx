import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'
import { useToast } from './ToastContext'
import type { IUsuario } from '../types'

type NovoUsuario = Omit<IUsuario, 'id'>

interface UserContextData {
    users: IUsuario[];
    deleteUser: (id: string | number) => Promise<void>;
    addUser: (usuario: NovoUsuario) => Promise<void>;
    updateUser: (usuario: IUsuario) => Promise<void>;
}

const UserContext = createContext({} as UserContextData)

interface UserProviderProps {
    children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [users, setUsers] = useState<IUsuario[]>([])
    const { addToast } = useToast()

    useEffect(() => {
        api.get('/users')
            .then(response => setUsers(response.data))
            .catch(() => addToast({ type: 'error', title: 'Erro', description: 'Falha ao carregar usuários' }))
    }, [addToast])

    async function deleteUser(id: string | number) {
        try {
            await api.delete(`/users/${id}`)
            setUsers((lista) => lista.filter((user) => user.id !== id))
            addToast({ type: 'success', title: 'Sucesso', description: 'Usuário removido.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Não foi possível remover o usuário.' })
        }
    }

    async function addUser(usuario: NovoUsuario) {
        try {
            const response = await api.post('/users', usuario)
            setUsers((lista) => [...lista, response.data])
            addToast({ type: 'success', title: 'Sucesso', description: 'Usuário criado.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Email ou CPF já cadastrados.' })
        }
    }

    async function updateUser(usuarioAtualizado: IUsuario) {
        try {
            const response = await api.put(`/users/${usuarioAtualizado.id}`, usuarioAtualizado)
            setUsers((lista) =>
                lista.map((user) =>
                    user.id === usuarioAtualizado.id ? response.data : user
                )
            )
            addToast({ type: 'success', title: 'Sucesso', description: 'Usuário atualizado.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao atualizar usuário.' })
        }
    }

    return (
        <UserContext.Provider value={{ users, deleteUser, addUser, updateUser }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUsers() {
    return useContext(UserContext)
}