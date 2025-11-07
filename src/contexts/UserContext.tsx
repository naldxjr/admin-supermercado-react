import React, { createContext, useContext, useState } from 'react'
import type { IUsuario } from '../types'
import { MOCK_USUARIOS } from '../services/mockData'

type NovoUsuario = Omit<IUsuario, 'id'>

interface UserContextData {
    users: IUsuario[];
    deleteUser: (id: string | number) => void;
    addUser: (usuario: NovoUsuario) => void;
    updateUser: (usuario: IUsuario) => void;
}

const UserContext = createContext({} as UserContextData)

interface UserProviderProps {
    children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [users, setUsers] = useState<IUsuario[]>(MOCK_USUARIOS)

    function deleteUser(id: string | number) {
        setUsers((lista) => lista.filter((user) => user.id !== id))
    }

    function addUser(usuario: NovoUsuario) {
        const novoUsuarioComId: IUsuario = {
            ...usuario,
            id: new Date().getTime(),
        }
        setUsers([novoUsuarioComId, ...users])
    }

    function updateUser(usuarioAtualizado: IUsuario) {
        setUsers((lista) =>
            lista.map((user) =>
                user.id === usuarioAtualizado.id ? usuarioAtualizado : user
            )
        )
    }

    const value = {
        users,
        deleteUser,
        addUser,
        updateUser,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUsers() {
    const context = useContext(UserContext)
    return context
}
