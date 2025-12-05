import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'
import { useToast } from './ToastContext'
import type { ICliente } from '../types'

type NovoCliente = Omit<ICliente, 'id'>

interface ClientContextData {
    clients: ICliente[];
    deleteClient: (id: number) => Promise<void>;
    addClient: (cliente: NovoCliente) => Promise<void>;
    updateClient: (cliente: ICliente) => Promise<void>;
}

const ClientContext = createContext({} as ClientContextData)

interface ClientProviderProps {
    children: React.ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
    const [clients, setClients] = useState<ICliente[]>([])
    const { addToast } = useToast()

    useEffect(() => {
        api.get('/clients')
            .then(response => setClients(response.data))
            .catch(() => addToast({ type: 'error', title: 'Erro', description: 'Falha ao carregar clientes' }))
    }, [addToast])

    async function deleteClient(id: number) {
        try {
            await api.delete(`/clients/${id}`)
            setClients((lista) => lista.filter((client) => client.id !== id))
            addToast({ type: 'success', title: 'Sucesso', description: 'Cliente removido.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Não foi possível remover o cliente.' })
        }
    }

    async function addClient(cliente: NovoCliente) {
        try {
            const response = await api.post('/clients', cliente)
            setClients((lista) => [...lista, response.data])
            addToast({ type: 'success', title: 'Sucesso', description: 'Cliente cadastrado.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Identidade já cadastrada.' })
        }
    }

    async function updateClient(clienteAtualizado: ICliente) {
        try {
            const response = await api.put(`/clients/${clienteAtualizado.id}`, clienteAtualizado)
            setClients((lista) =>
                lista.map((client) =>
                    client.id === clienteAtualizado.id ? response.data : client
                )
            )
            addToast({ type: 'success', title: 'Sucesso', description: 'Dados atualizados.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao atualizar cliente.' })
        }
    }

    return (
        <ClientContext.Provider value={{ clients, deleteClient, addClient, updateClient }}>
            {children}
        </ClientContext.Provider>
    )
}

export function useClients() {
    return useContext(ClientContext)
}