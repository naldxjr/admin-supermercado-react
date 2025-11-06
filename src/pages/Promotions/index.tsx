import { useProducts } from '../../contexts/ProductContext'
import type { IProduto } from '../../types'
import './styles.css'

export function Promotions() {
  const { products, updateProduct } = useProducts()

  function handleAddPromotion(produto: IProduto) {
    const novoPrecoStr = window.prompt(
      `Aplicar promoção para: ${produto.nome}\nDigite o novo preço promocional (ex: 4.99):`,
      String(produto.precoPromocional ?? '')
    )

    if (novoPrecoStr === null) return 

    const novoPrecoNum = parseFloat(novoPrecoStr)

    if (isNaN(novoPrecoNum) || novoPrecoNum <= 0) {
      alert('Por favor, insira um preço válido.')
      return
    }

    if (novoPrecoNum >= produto.precoAtual) {
      alert('O preço promocional deve ser MENOR que o preço atual.')
      return
    }

    updateProduct({
      ...produto,
      precoPromocional: novoPrecoNum,
    })
  }

  function handleRemovePromotion(produto: IProduto) {
    if (window.confirm('Tem certeza que deseja remover esta promoção?')) {
      updateProduct({
        ...produto,
        precoPromocional: null,
      })
    }
  }

  return (
    <div className="promotions-container">
      <h1>Aplicar e Remover Promoções</h1>

      <table className="promotions-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço Atual</th>
            <th>Preço Promocional</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.nome}</td>
              <td>
                {product.precoAtual.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </td>
              <td>
                {product.precoPromocional ? (
                  <strong>
                    {product.precoPromocional.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </strong>
                ) : (
                  '---'
                )}
              </td>
              <td className="promotion-actions">
                <button
                  className="action-button add-promo-button"
                  onClick={() => handleAddPromotion(product)}
                >
                  Aplicar Promoção
                </button>

                {product.precoPromocional && (
                  <button
                    className="action-button remove-promo-button"
                    onClick={() => handleRemovePromotion(product)}
                  >
                    Remover
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}