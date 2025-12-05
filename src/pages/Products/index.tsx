import { useState } from 'react'
import { useProducts } from '../../contexts/ProductContext'
import { Modal } from '../../components/Modal'
import type { IProduto } from '../../types'
import './styles.css'
import '../../components/Form/styles.css'

const ActionIcons = {
    Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
}

export function Products() {
    const { products, deleteProduct, addProduct, updateProduct } = useProducts()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<IProduto | null>(null)
    const [deleteId, setDeleteId] = useState<number | string | null>(null)
 
    const [nome, setNome] = useState('')
    const [tipo, setTipo] = useState('')
    const [precoAtual, setPrecoAtual] = useState('')
    const [precoPromocional, setPrecoPromocional] = useState('')
    const [dataValidade, setDataValidade] = useState('')
    const [descricao, setDescricao] = useState('')
 
    function resetForm() {
        setNome('')
        setTipo('')
        setPrecoAtual('')
        setPrecoPromocional('')
        setDataValidade('')
        setDescricao('')
    }
 
    function handleOpenCreateModal() {
        resetForm()
        setEditingProduct(null)
        setIsModalOpen(true)
    }
 
    function handleOpenEditModal(produto: IProduto) {
        setEditingProduct(produto)
        setNome(produto.nome)
        setTipo(produto.tipo)
        setPrecoAtual(String(produto.precoAtual))
        setPrecoPromocional(String(produto.precoPromocional ?? ''))
        setDataValidade(produto.dataValidade)
        setDescricao(produto.descricao)
        setIsModalOpen(true)
    }
 
    function handleCloseModal() {
        resetForm()
        setEditingProduct(null)
        setIsModalOpen(false)
    }
 
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        const dadosDoFormulario = {
            nome, tipo, precoAtual: parseFloat(precoAtual),
            precoPromocional: precoPromocional ? parseFloat(precoPromocional) : null,
            dataValidade, descricao,
        }
 
        if (editingProduct) {
            await updateProduct({ ...dadosDoFormulario, id: editingProduct.id })
        } else {
            await addProduct(dadosDoFormulario)
        }
        handleCloseModal()
    }

    async function handleConfirmDelete() {
        if (deleteId) {
            await deleteProduct(deleteId)
            setDeleteId(null)
        }
    }
 
    return (
        <div className="products-container">
            <header className="products-header">
                <div>
                    <h1>Produtos</h1>
                    <p style={{color: 'var(--color-text-muted)', fontSize: '0.9rem'}}>Gerencie o inventário do supermercado</p>
                </div>
                <button className="new-button" onClick={handleOpenCreateModal}>
                    <ActionIcons.Plus /> Novo Produto
                </button>
            </header>
 
            <table className="products-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Promoção</th>
                        <th style={{textAlign: 'right'}}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td style={{fontWeight: 500}}>{product.nome}</td>
                            <td><span style={{padding: '4px 8px', background: '#e0e7ff', color: '#4338ca', borderRadius: '4px', fontSize: '0.85rem'}}>{product.tipo}</span></td>
                            <td>
                                {product.precoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td>
                                {product.precoPromocional ? (
                                    <span style={{color: 'var(--color-success)', fontWeight: 600}}>
                                        {product.precoPromocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                ) : <span style={{color: '#9ca3af'}}>-</span>}
                            </td>
                            <td className="product-actions" style={{justifyContent: 'flex-end'}}>
                                <button className="action-button edit-button" onClick={() => handleOpenEditModal(product)} title="Editar">
                                    <ActionIcons.Edit />
                                </button>
                                <button className="action-button delete-button" onClick={() => setDeleteId(product.id)} title="Excluir">
                                    <ActionIcons.Trash />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr><td colSpan={5} style={{textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)'}}>Nenhum produto cadastrado.</td></tr>
                    )}
                </tbody>
            </table>
 
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? 'Editar Produto' : 'Novo Produto'}>
                <form onSubmit={handleSubmit} className="form-body">
                    <div className="form-group full-width">
                        <label>Nome do Produto</label>
                        <input value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Preço (R$)</label>
                            <input type="number" step="0.01" value={precoAtual} onChange={(e) => setPrecoAtual(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Preço Promo (Opcional)</label>
                            <input type="number" step="0.01" value={precoPromocional} onChange={(e) => setPrecoPromocional(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Categoria</label>
                            <input value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Ex: Laticínio" required />
                        </div>
                        <div className="form-group">
                            <label>Validade</label>
                            <input type="date" value={dataValidade} onChange={(e) => setDataValidade(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label>Descrição</label>
                        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="form-button secondary" onClick={handleCloseModal}>Cancelar</button>
                        <button type="submit" className="form-button primary">Salvar</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Exclusão">
                <div className="form-body">
                    <p style={{color: 'var(--color-text-muted)'}}>Tem certeza que deseja remover este produto? Esta ação não pode ser desfeita.</p>
                    <div className="form-actions">
                        <button className="form-button secondary" onClick={() => setDeleteId(null)}>Cancelar</button>
                        <button className="form-button delete-button" onClick={handleConfirmDelete}>Confirmar Exclusão</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}