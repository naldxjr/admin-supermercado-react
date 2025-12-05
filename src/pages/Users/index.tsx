import { useState } from 'react'
import { useUsers } from '../../contexts/UserContext'
import type { IUsuario } from '../../types'
import { Modal } from '../../components/Modal'
import './styles.css'
import '../../components/Form/styles.css'

const ActionIcons = {
    Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
}

export function Users() {
  const { users, deleteUser, addUser, updateUser } = useUsers()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<IUsuario | null>(null)
  const [deleteId, setDeleteId] = useState<string | number | null>(null)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')

  function resetForm() {
    setNome('')
    setEmail('')
    setCpf('')
    setSenha('')
  }

  function handleOpenCreateModal() {
    resetForm()
    setEditingUser(null)
    setIsModalOpen(true)
  }

  function handleOpenEditModal(usuario: IUsuario) {
    setEditingUser(usuario)
    setNome(usuario.nome)
    setEmail(usuario.email)
    setCpf(usuario.cpf)
    setSenha('')
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    resetForm()
    setEditingUser(null)
    setIsModalOpen(false)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (editingUser) {
      await updateUser({ id: editingUser.id, nome, email, cpf, ...(senha && { senha }) })
    } else {
      if (!senha) return 
      await addUser({ nome, email, cpf, senha })
    }
    handleCloseModal()
  }

  async function handleConfirmDelete() {
    if (deleteId) {
        await deleteUser(deleteId)
        setDeleteId(null)
    }
  }

  return (
    <div className="users-container">
      <header className="users-header">
        <div>
            <h1>Utilizadores</h1>
            <p style={{color: 'var(--color-text-muted)', fontSize: '0.9rem'}}>Gerencie o acesso da equipe ao sistema</p>
        </div>
        <button className="new-button" onClick={handleOpenCreateModal}>
          <ActionIcons.Plus /> Novo Utilizador
        </button>
      </header>

      <table className="users-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th style={{textAlign: 'right'}}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{fontWeight: 500}}>{user.nome}</td>
              <td>{user.email}</td>
              <td><span style={{fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--color-text-muted)'}}>{user.cpf}</span></td>
              <td className="user-actions" style={{justifyContent: 'flex-end'}}>
                <button className="action-button edit-button" onClick={() => handleOpenEditModal(user)} title="Editar">
                  <ActionIcons.Edit />
                </button>
                <button className="action-button delete-button" onClick={() => setDeleteId(user.id)} title="Excluir">
                  <ActionIcons.Trash />
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
             <tr><td colSpan={4} style={{textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)'}}>Nenhum usuário cadastrado.</td></tr>
          )}
        </tbody>
      </table>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}>
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group full-width">
            <label>Nome Completo</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>CPF</label>
              <input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" required />
            </div>
          </div>
          <div className="form-group full-width">
            <label>Senha {editingUser && <span style={{fontWeight: 400, color: 'var(--color-text-muted)'}}>(Deixe em branco para manter)</span>}</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" required={!editingUser} />
          </div>
          <div className="form-actions">
            <button type="button" className="form-button secondary" onClick={handleCloseModal}>Cancelar</button>
            <button type="submit" className="form-button primary">Salvar</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Exclusão">
        <div className="form-body">
            <p style={{color: 'var(--color-text-muted)'}}>Tem certeza que deseja remover este usuário?</p>
            <div className="form-actions">
                <button className="form-button secondary" onClick={() => setDeleteId(null)}>Cancelar</button>
                <button className="form-button delete-button" onClick={handleConfirmDelete}>Confirmar Exclusão</button>
            </div>
        </div>
      </Modal>
    </div>
  )
}