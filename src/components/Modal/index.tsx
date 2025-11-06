import React from 'react'
import './styles.css'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) {
        return null
    }

    function handleContentClick(event: React.MouseEvent) {
        event.stopPropagation()
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={handleContentClick}>
                <header className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose} className="modal-close-button">
                        &times;
                    </button>
                </header>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    )
}
