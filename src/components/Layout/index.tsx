import React, { useState, useRef, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Modal } from '../Modal'
import { formatCPF } from '../../utils/cpf'
import './styles.css'

const Icons = {
    Box: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
    Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Clients: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Tag: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>,
    LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    Camera: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>,
    Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.82 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Eye: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
}

export function Layout() {
    const { signOut, user, updateProfilePicture, updateProfile, removeProfilePicture } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    
    // Estados do Menu e Modais
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [isEditDataOpen, setIsEditDataOpen] = useState(false)
    const [isViewPhotoOpen, setIsViewPhotoOpen] = useState(false) // NOVO
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Estados do Formulário de Edição
    const [editName, setEditName] = useState('')
    const [editEmail, setEditEmail] = useState('')
    const [editCpf, setEditCpf] = useState('')
    const [editPassword, setEditPassword] = useState('')

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (file) {
            await updateProfilePicture(file)
            setIsProfileModalOpen(false)
        }
    }

    async function handleRemovePhoto() {
        await removeProfilePicture()
        setIsDropdownOpen(false)
    }

    // Função para abrir o visualizador de foto
    function handleViewPhoto() {
        setIsViewPhotoOpen(true)
        setIsDropdownOpen(false)
    }

    function handleOpenEditData() {
        if (user) {
            setEditName(user.nome)
            setEditEmail(user.email)
            setEditCpf(user.cpf || '')
            setEditPassword('')
            setIsEditDataOpen(true)
            setIsDropdownOpen(false)
        }
    }

    async function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault()
        try {
            await updateProfile({
                nome: editName,
                email: editEmail,
                cpf: editCpf,
                ...(editPassword ? { senha: editPassword } : {})
            })
            setIsEditDataOpen(false)
        } catch (error) {
            // Erro já tratado no contexto
        }
    }

    const isActive = (path: string) => location.pathname === path ? 'active' : ''

    return (
        <div className="layout-container">
            <aside className="layout-sidebar">
                
                {user && (
                    <div className="profile-section" ref={dropdownRef}>
                        <div 
                            className={`profile-block ${isDropdownOpen ? 'active' : ''}`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="profile-avatar">
                                {user.avatarUrl ? <img src={user.avatarUrl} alt="Perfil" /> : <span>{getInitials(user.nome)}</span>}
                            </div>
                            <div className="profile-info">
                                <h3>{user.nome}</h3>
                                <span>{user.email}</span>
                            </div>
                            <div className="profile-chevron"><Icons.ChevronDown /></div>
                        </div>

                        {isDropdownOpen && (
                            <div className="profile-dropdown">
                                <div className="dropdown-header">Minha Conta</div>
                                
                                {/* Opção VER FOTO (só aparece se tiver foto) */}
                                {user.avatarUrl && (
                                    <button className="dropdown-item" onClick={handleViewPhoto}>
                                        <Icons.Eye /> Ver Foto Original
                                    </button>
                                )}

                                <button className="dropdown-item" onClick={() => setIsProfileModalOpen(true)}>
                                    <Icons.Camera /> Alterar Foto
                                </button>
                                
                                {user.avatarUrl && (
                                    <button className="dropdown-item danger" onClick={handleRemovePhoto}>
                                        <Icons.Trash /> Remover Foto
                                    </button>
                                )}

                                <button className="dropdown-item" onClick={handleOpenEditData}>
                                    <Icons.Settings /> Editar Dados
                                </button>
                                
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item danger" onClick={handleSignOut}>
                                    <Icons.LogOut /> Sair da Conta
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <nav className="layout-nav">
                    <Link to="/products" className={isActive('/products')}>
                        <Icons.Box /> Produtos
                    </Link>
                    <Link to="/clients" className={isActive('/clients')}>
                        <Icons.Clients /> Clientes
                    </Link>
                    <Link to="/users" className={isActive('/users')}>
                        <Icons.Users /> Utilizadores
                    </Link>
                    <Link to="/promotions" className={isActive('/promotions')}>
                        <Icons.Tag /> Promoções
                    </Link>
                </nav>
            </aside>

            <main className="layout-content">
                <Outlet />
            </main>

            {/* Modal de Foto */}
            <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Alterar Foto de Perfil">
                <div className="upload-form">
                    <div className="upload-icon-large"><Icons.Camera /></div>
                    <p>Carregue uma nova imagem (JPG ou PNG)</p>
                    <label htmlFor="avatar-upload" className="upload-label">Selecionar Imagem</label>
                    <input id="avatar-upload" type="file" className="upload-input" accept="image/*" onChange={handleFileChange} />
                </div>
            </Modal>

            {/* NOVO: Modal para VER A FOTO GRANDE */}
            <Modal isOpen={isViewPhotoOpen} onClose={() => setIsViewPhotoOpen(false)} title="Sua Foto de Perfil">
                <div className="view-photo-container">
                    {user?.avatarUrl && (
                        <img src={user.avatarUrl} alt="Foto de Perfil Grande" />
                    )}
                </div>
            </Modal>

            {/* Modal de Editar Dados */}
            <Modal isOpen={isEditDataOpen} onClose={() => setIsEditDataOpen(false)} title="Meus Dados">
                <form onSubmit={handleSaveProfile} className="form-body">
                    <div className="form-group full-width">
                        <label>Nome Completo</label>
                        <input value={editName} onChange={e => setEditName(e.target.value)} required />
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>CPF</label>
                            <input 
                                value={editCpf} 
                                onChange={e => setEditCpf(formatCPF(e.target.value))}
                                maxLength={14}
                                required 
                            />
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label>Nova Senha <span style={{fontWeight: 400, color: 'var(--color-text-muted)'}}>(Opcional)</span></label>
                        <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="Deixe em branco para não alterar" />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="form-button secondary" onClick={() => setIsEditDataOpen(false)}>Cancelar</button>
                        <button type="submit" className="form-button primary">Atualizar Perfil</button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}