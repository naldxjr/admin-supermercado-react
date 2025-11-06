 import React, { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Modal } from '../Modal'
import './styles.css'

export function Layout() {
    const { signOut, user, updateProfilePicture } = useAuth()
    const navigate = useNavigate()

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

    function handleSignOut() {
        signOut()
        navigate('/login')
    }

    function getInitials(name: string): string {
        const parts = name.split(' ')
        const first = parts[0]?.[0] || ''
        const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : ''
        return `${first}${last}`.toUpperCase()
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione um arquivo de imagem (PNG, JPG, etc.).')
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            const base64Image = reader.result as string
            updateProfilePicture(base64Image)
            setIsProfileModalOpen(false)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="layout-container">
            <aside className="layout-sidebar">
                {user && (
                    <div className="profile-block">
                        <div
                            className="profile-avatar clickable"
                            onClick={() => setIsProfileModalOpen(true)}
                            title="Mudar foto de perfil"
                        >
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Foto de Perfil" />
                            ) : (
                                <span>{getInitials(user.nome)}</span>
                            )}
                        </div>
                        <h3>{user.nome}</h3>
                        <span>{user.email}</span>
                    </div>
                )}

                <nav className="layout-nav">
                    <Link to="/products">Produtos</Link>
                    <Link to="/users">Usuários</Link>
                    <Link to="/promotions">Promoções</Link>
                </nav>

                <button onClick={handleSignOut} className="logout-button">
                    Sair
                </button>
            </aside>

            <main className="layout-content">
                <Outlet />
            </main>

            <Modal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                title="Atualizar Foto de Perfil"
            >
                <div className="upload-form">
                    <p>Selecione uma nova foto de perfil (PNG ou JPG).</p>

                    <label htmlFor="avatar-upload" className="upload-label">
                        Escolher Arquivo
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        className="upload-input"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
            </Modal>
        </div>
    )
}
