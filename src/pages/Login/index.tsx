import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Modal } from '../../components/Modal' // Importando o Modal
import { formatCPF } from '../../utils/cpf' // Importando formatador
import './styles.css'

const Icons = {
    User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Lock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
    Arrow: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
    Bag: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
}

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const [isRecoverModalOpen, setIsRecoverModalOpen] = useState(false)
    const [recoverEmail, setRecoverEmail] = useState('')
    const [recoverCpf, setRecoverCpf] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const { signIn, recoverPassword } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        setLoading(true)

        try {
            await signIn(email, password)
            navigate('/products')
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    async function handleRecoverSubmit(event: React.FormEvent) {
        event.preventDefault()
        try {
            await recoverPassword(recoverEmail, recoverCpf, newPassword)
            setIsRecoverModalOpen(false) 
            setRecoverEmail('')
            setRecoverCpf('')
            setNewPassword('')
        } catch (error) {
        }
    }

    return (
        <div className="login-page">
            <div className="login-overlay"></div>
            <div className="login-content">
                <div className="brand-header">
                    <div className="logo-container">
                        <Icons.Bag />
                    </div>
                    <h1>Admin SuperMarket</h1>
                </div>

                <div className="login-card">
                    <div className="card-header">
                        <h2>Acesso Restrito</h2>
                        <p>Gestão e Controle de Estoque</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email</label>
                            <div className="input-wrapper">
                                <div className="icon-box"><Icons.User /></div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ex: admin@mercado.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="label-row">
                                <label>Senha</label>
                                <button 
                                    type="button" 
                                    className="forgot-btn" 
                                    onClick={() => setIsRecoverModalOpen(true)}
                                >
                                    Esqueceu?
                                </button>
                            </div>
                            <div className="input-wrapper">
                                <div className="icon-box"><Icons.Lock /></div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? 'Verificando...' : (
                                <>Entrar no Sistema <Icons.Arrow /></>
                            )}
                        </button>
                    </form>
                </div>
                
                <p className="copyright">© 2025 Admin Supermercado</p>
            </div>

            {/* Modal de Recuperação de Senha */}
            <Modal 
                isOpen={isRecoverModalOpen} 
                onClose={() => setIsRecoverModalOpen(false)} 
                title="Recuperar Senha"
            >
                <form onSubmit={handleRecoverSubmit} className="form-body">
                    <p style={{color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem'}}>
                        Confirme seus dados para redefinir sua senha de acesso.
                    </p>
                    
                    <div className="form-group">
                        <label>Seu Email Cadastrado</label>
                        <input 
                            type="email" 
                            value={recoverEmail} 
                            onChange={(e) => setRecoverEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Seu CPF (Segurança)</label>
                        <input 
                            value={recoverCpf} 
                            onChange={(e) => setRecoverCpf(formatCPF(e.target.value))} 
                            maxLength={14}
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Nova Senha</label>
                        <input 
                            type="password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            placeholder="Mínimo 6 caracteres"
                            required 
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="form-button secondary" onClick={() => setIsRecoverModalOpen(false)}>
                            Cancelar
                        </button>
                        <button type="submit" className="form-button primary">
                            Redefinir Senha
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}