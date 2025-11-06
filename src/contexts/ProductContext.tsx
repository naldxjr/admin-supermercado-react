import React, { createContext, useContext, useState } from 'react'
import type { IProduto } from '../types'
import { MOCK_PRODUTOS } from '../services/mockData'
 
type NovoProduto = Omit<IProduto, 'id'>
 
interface ProductContextData {
    products: IProduto[];
    deleteProduct: (id: string | number) => void;
    addProduct: (produto: NovoProduto) => void;
    updateProduct: (produto: IProduto) => void;
}
 
const ProductContext = createContext({} as ProductContextData)
 
interface ProductProviderProps {
    children: React.ReactNode;
}
 
export function ProductProvider({ children }: ProductProviderProps) {
    const [products, setProducts] = useState<IProduto[]>(MOCK_PRODUTOS)
 
    function deleteProduct(id: string | number) {
        const updatedProducts = products.filter((product) => product.id !== id)
        setProducts(updatedProducts)
    }
 
    function addProduct(produto: NovoProduto) {
        const novoProdutoComId: IProduto = {
            ...produto,
            id: new Date().getTime(),
        }
        setProducts([novoProdutoComId, ...products])
    }
 
    function updateProduct(produtoAtualizado: IProduto) {
        setProducts((listaAntiga) =>
            listaAntiga.map((produto) =>
                produto.id === produtoAtualizado.id ? produtoAtualizado : produto
            )
        )
    }
 
    const value = {
        products,
        deleteProduct,
        addProduct,
        updateProduct,
    }
 
    return (
        <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
    )
}
 
export function useProducts() {
    const context = useContext(ProductContext)
    return context
}
 
