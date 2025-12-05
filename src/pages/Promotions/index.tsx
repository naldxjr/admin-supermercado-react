import { useState } from 'react'
import { useProducts } from '../../contexts/ProductContext'
import { useToast } from '../../contexts/ToastContext'
import { Modal } from '../../components/Modal'
import type { IProduto } from '../../types'
import './styles.css'

const ActionIcons = {
  Percent: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
}

export function Promotions() {
  const { products, updateProduct } = useProducts()
  const { addToast } = useToast()

  const [selectedProduct, setSelectedProduct] = useState<IProduto | null>(null)
  const [promoPrice, setPromoPrice] = useState('')
  const [confirmRemove, setConfirmRemove] = useState<IProduto | null>(null)

  function openPromoModal(produto: IProduto) {
    setSelectedProduct(produto)
    setPromoPrice(produto.precoPromocional ? String(produto.precoPromocional) : '')
  }

  async function handleSavePromo(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedProduct) return

    const price = parseFloat(promoPrice)
    if (isNaN(price) || price <= 0) {
      addToast({ type: 'error', title: 'Erro', description: 'Preço inválido.' })
      return
    }
    if (price >= selectedProduct.precoAtual) {
      addToast({ type: 'error', title: 'Erro', description: 'O preço promo deve ser menor que o atual.' })
      return
    }

    await updateProduct({ ...selectedProduct, precoPromocional: price })
    setSelectedProduct(null)
  }

  async function handleRemovePromo() {
    if (confirmRemove) {
      await updateProduct({ ...confirmRemove, precoPromocional: null })
      setConfirmRemove(null)
    }
  }

  return (
    <div className="promotions-container">
      <header className="clients-header">
        <div>
          <h1>Promoções</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Gerencie ofertas e descontos ativos</p>
        </div>
      </header>

      <table className="promotions-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço Original</th>
            <th>Preço Promocional</th>
            <th style={{ textAlign: 'right' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ fontWeight: 500 }}>{product.nome}</td>
              <td style={{ color: product.precoPromocional ? 'var(--color-text-muted)' : 'inherit', textDecoration: product.precoPromocional ? 'line-through' : 'none' }}>
                {product.precoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
              <td>
                {product.precoPromocional ? (
                  <span style={{ padding: '4px 8px', background: '#ecfdf5', color: '#047857', borderRadius: '4px', fontWeight: 700 }}>
                    {product.precoPromocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                ) : <span style={{ color: '#9ca3af' }}>-</span>}
              </td>
              <td className="promotion-actions" style={{ justifyContent: 'flex-end' }}>
                <button
                  className="action-button add-promo-button"
                  onClick={() => openPromoModal(product)}
                  title="Aplicar/Editar Promoção"
                >
                  <ActionIcons.Percent />
                </button>

                {product.precoPromocional && (
                  <button
                    className="action-button remove-promo-button"
                    onClick={() => setConfirmRemove(product)}
                    title="Remover Promoção"
                  >
                    <ActionIcons.Trash />
                  </button>
                )}
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Nenhum produto disponível para promoção.</td></tr>
          )}
        </tbody>
      </table>

      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={`Promoção: ${selectedProduct?.nome}`}>
        <form onSubmit={handleSavePromo} className="form-body">
          <div className="form-group">
            <label>Preço Atual: R$ {selectedProduct?.precoAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</label>
          </div>
          <div className="form-group">
            <label>Novo Preço Promocional</label>
            <input type="number" step="0.01" value={promoPrice} onChange={e => setPromoPrice(e.target.value)} autoFocus required />
          </div>
          <div className="form-actions">
            <button type="button" className="form-button secondary" onClick={() => setSelectedProduct(null)}>Cancelar</button>
            <button type="submit" className="form-button primary">Aplicar Promoção</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!confirmRemove} onClose={() => setConfirmRemove(null)} title="Remover Promoção">
        <div className="form-body">
          <p style={{ color: 'var(--color-text-muted)' }}>Deseja remover o desconto de <strong>{confirmRemove?.nome}</strong>?</p>
          <div className="form-actions">
            <button className="form-button secondary" onClick={() => setConfirmRemove(null)}>Cancelar</button>
            <button className="form-button delete-button" onClick={handleRemovePromo}>Confirmar Remoção</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}