import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './styles.css'

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signIn } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        console.log('Email:', email)
        console.log('Senha:', password)

        signIn()

        navigate('/products')
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Login Administrativo</h1>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Senha</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        required
                    />
                </div>

                <button type="submit" className="login-button">
                    Entrar
                </button>
            </form>
        </div>
    )
}
