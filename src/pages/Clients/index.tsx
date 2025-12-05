import { useState } from 'react'
import { useClients } from '../../contexts/ClientContext'
import { Modal } from '../../components/Modal'
import type { ICliente } from '../../types'
import './styles.css'
import '../../components/Form/styles.css'

const ActionIcons = {
    Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
}

export function Clients() {
    const { clients, addClient, deleteClient, updateClient } = useClients()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingClient, setEditingClient] = useState<ICliente | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const [nome, setNome] = useState('')
    const [identidade, setIdentidade] = useState('')
    const [idade, setIdade] = useState('')
    const [tempoCliente, setTempoCliente] = useState('')

    function handleOpenModal(client?: ICliente) {
        if (client) {
            setEditingClient(client)
            setNome(client.nome)
            setIdentidade(client.identidade)
            setIdade(String(client.idade))
            setTempoCliente(String(client.tempoCliente))
        } else {
            setEditingClient(null)
            setNome('')
            setIdentidade('')
            setIdade('')
            setTempoCliente('')
        }
        setIsModalOpen(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const dados = { nome, identidade, idade: Number(idade), tempoCliente: Number(tempoCliente) }

        if (editingClient) {
            await updateClient({ ...dados, id: editingClient.id })
        } else {
            await addClient(dados)
        }
        setIsModalOpen(false)
    }

    async function handleConfirmDelete() {
        if (deleteId) {
            await deleteClient(deleteId)
            setDeleteId(null)
        }
    }

    return (
        <div className="clients-container">
            <header className="clients-header">
                <div>
                    <h1>Clientes</h1>
                    <p style={{color: 'var(--color-text-muted)', fontSize: '0.9rem'}}>Base de clientes fidelidade</p>
                </div>
                <button className="new-button" onClick={() => handleOpenModal()}>
                    <ActionIcons.Plus /> Novo Cliente
                </button>
            </header>

            <table className="clients-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Identidade/CPF</th>
                        <th>Idade</th>
                        <th>Fidelidade</th>
                        <th style={{textAlign: 'right'}}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
                        <tr key={client.id}>
                            <td style={{fontWeight: 500}}>{client.nome}</td>
                            <td><span style={{fontFamily: 'monospace', color: 'var(--color-text-muted)'}}>{client.identidade}</span></td>
                            <td>{client.idade} anos</td>
                            <td><span style={{padding: '4px 8px', background: '#ecfdf5', color: '#047857', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600}}>{client.tempoCliente} anos</span></td>
                            <td className="product-actions" style={{justifyContent: 'flex-end'}}>
                                <button className="action-button edit-button" onClick={() => handleOpenModal(client)} title="Editar">
                                    <ActionIcons.Edit />
                                </button>
                                <button className="action-button delete-button" onClick={() => setDeleteId(client.id)} title="Excluir">
                                    <ActionIcons.Trash />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {clients.length === 0 && (
                        <tr><td colSpan={5} style={{textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)'}}>Nenhum cliente na base.</td></tr>
                    )}
                </tbody>
            </table>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}>
                <form onSubmit={handleSubmit} className="form-body">
                    <div className="form-group full-width">
                        <label>Nome Completo</label>
                        <input value={nome} onChange={e => setNome(e.target.value)} required />
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Identidade / CPF</label>
                            <input value={identidade} onChange={e => setIdentidade(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Idade</label>
                            <input type="number" value={idade} onChange={e => setIdade(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label>Tempo de Cliente (Anos)</label>
                        <input type="number" value={tempoCliente} onChange={e => setTempoCliente(e.target.value)} required />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="form-button secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        <button type="submit" className="form-button primary">Salvar</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Exclusão">
                <div className="form-body">
                    <p style={{color: 'var(--color-text-muted)'}}>Tem certeza que deseja remover este cliente?</p>
                    <div className="form-actions">
                        <button className="form-button secondary" onClick={() => setDeleteId(null)}>Cancelar</button>
                        <button className="form-button delete-button" onClick={handleConfirmDelete}>Confirmar Exclusão</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}