import { useState } from 'react'

import { useProducts } from '../../contexts/ProductContext'
import { Modal } from '../../components/Modal'
import type { IProduto } from '../../types'
import './styles.css'
import '../../components/Form/styles.css'
 
export function Products() {
    const { products, deleteProduct, addProduct, updateProduct } = useProducts()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<IProduto | null>(null)
 
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
 
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
 
        const dadosDoFormulario = {
            nome,
            tipo,
            precoAtual: parseFloat(precoAtual),
            precoPromocional: precoPromocional ? parseFloat(precoPromocional) : null,
            dataValidade,
            descricao,
        }
 
        if (editingProduct) {
            updateProduct({
                ...dadosDoFormulario,
                id: editingProduct.id,
            })
        } else {
            addProduct(dadosDoFormulario)
        }
 
        handleCloseModal()
    }
 
    return (
        <div className="products-container">
            <header className="products-header">
                <h1>Gerenciamento de Produtos</h1>
                <button className="new-button" onClick={handleOpenCreateModal}>
                    + Adicionar Produto
                </button>
            </header>
 
            <table className="products-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Preço Atual</th>
                        <th>Preço Promocional</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.nome}</td>
                            <td>{product.tipo}</td>
                            <td>
                                {product.precoAtual.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}
                            </td>
                            <td>
                                {product.precoPromocional
                                    ? product.precoPromocional.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })
                                    : '---'}
                            </td>
                            <td className="product-actions">
                                <button
                                    className="action-button edit-button"
                                    onClick={() => handleOpenEditModal(product)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="action-button delete-button"
                                    onClick={() =>
                                        window.confirm('Certeza?') && deleteProduct(product.id)
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
                title={editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
            >
                <form onSubmit={handleSubmit} className="form-body">
                    <div className="form-group full-width">
                        <label htmlFor="nome">Nome do Produto</label>
                        <input
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>
 
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="precoAtual">Preço Atual (R$)</label>
                            <input
                                id="precoAtual"
                                type="number"
                                step="0.01"
                                min="0"
                                value={precoAtual}
                                onChange={(e) => setPrecoAtual(e.target.value)}
                                required
                            />
                        </div>
 
                        <div className="form-group">
                            <label htmlFor="precoPromocional">Preço Promocional (Opcional)</label>
                            <input
                                id="precoPromocional"
                                type="number"
                                step="0.01"
                                min="0"
                                value={precoPromocional}
                                onChange={(e) => setPrecoPromocional(e.target.value)}
                                placeholder="Ex: 6.99"
                            />
                        </div>
                    </div>
 
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="tipo">Tipo / Categoria</label>
                            <input
                                id="tipo"
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                placeholder="Ex: Laticínio"
                                required
                            />
                        </div>
 
                        <div className="form-group">
                            <label htmlFor="dataValidade">Data de Validade</label>
                            <input
                                id="dataValidade"
                                type="date"
                                value={dataValidade}
                                onChange={(e) => setDataValidade(e.target.value)}
                                required
                            />
                        </div>
                    </div>
 
                    <div className="form-group full-width">
                        <label htmlFor="descricao">Descrição</label>
                        <textarea
                            id="descricao"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            required
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
                            {editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
 
