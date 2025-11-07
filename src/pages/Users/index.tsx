import { useState } from 'react'
import { useUsers } from '../../contexts/UserContext'
import type { IUsuario } from '../../types'
import { Modal } from '../../components/Modal'
import './styles.css'
import '../../components/Form/styles.css'

export function Users() {
  const { users, deleteUser, addUser, updateUser } = useUsers()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<IUsuario | null>(null)

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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (editingUser) {
      updateUser({
        id: editingUser.id,
        nome,
        email,
        cpf,
        ...(senha && { senha }),
      })
    } else {
      if (!senha) {
        alert('Por favor, informe uma senha para o novo usuário.')
        return
      }
      addUser({
        nome,
        email,
        cpf,
        senha,
      })
    }

    handleCloseModal()
  }

  return (
    <div className="users-container">
      <header className="users-header">
        <h1>Gerenciamento de Usuários</h1>
        <button className="new-button" onClick={handleOpenCreateModal}>
          + Adicionar Usuário
        </button>
      </header>

      <table className="users-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nome}</td>
              <td>{user.email}</td>
              <td>{user.cpf}</td>
              <td className="user-actions">
                <button
                  className="action-button edit-button"
                  onClick={() => handleOpenEditModal(user)}
                >
                  Editar
                </button>
                <button
                  className="action-button delete-button"
                  onClick={() =>
                    window.confirm('Certeza?') && deleteUser(user.id)
                  }
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
      >
        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-group full-width">
            <label htmlFor="nome">Nome Completo</label>
            <input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="111.222.333-44"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="senha">
              Senha {editingUser ? '(Deixe em branco para não alterar)' : ''}
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="********"
              required={!editingUser}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="form-button secondary"
              onClick={handleCloseModal}
            >
              Cancelar
            </button>
            <button type="submit" className="form-button primary">
              {editingUser ? 'Salvar Alterações' : 'Adicionar Usuário'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
