import React, { createContext, useContext, useState, useCallback } from 'react'
import '../components/Toast/styles.css'

interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info';
    title: string;
    description?: string;
}

interface ToastContextData {
    addToast: (message: Omit<ToastMessage, 'id'>) => void;
}
const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
)

const ToastContext = createContext<ToastContextData>({} as ToastContextData)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<ToastMessage[]>([])

    const addToast = useCallback(({ type, title, description }: Omit<ToastMessage, 'id'>) => {
        const id = Math.random().toString(36).substring(7)
        const toast = { id, type, title, description }

        setMessages((state) => [...state, toast])

        setTimeout(() => {
            setMessages((state) => state.filter((message) => message.id !== id))
        }, 4000)
    }, [])

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {messages.map((message) => (
                    <div key={message.id} className={`toast toast-${message.type}`}>
                        <div className="toast-content">
                            <strong>{message.title}</strong>
                            {message.description && <p>{message.description}</p>}
                        </div>
                        <button 
                            onClick={() => setMessages((s) => s.filter((m) => m.id !== message.id))}
                            className="toast-close"
                            type="button"
                        >
                            <XIcon />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    return useContext(ToastContext)
}