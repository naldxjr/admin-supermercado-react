import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'
import { useToast } from './ToastContext'
import type { IProduto } from '../types'

type NovoProduto = Omit<IProduto, 'id'>

interface ProductContextData {
    products: IProduto[];
    deleteProduct: (id: string | number) => Promise<void>;
    addProduct: (produto: NovoProduto) => Promise<void>;
    updateProduct: (produto: IProduto) => Promise<void>;
}

const ProductContext = createContext({} as ProductContextData)

interface ProductProviderProps {
    children: React.ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
    const [products, setProducts] = useState<IProduto[]>([])
    const { addToast } = useToast()

    useEffect(() => {
        api.get('/products')
            .then(response => setProducts(response.data))
            .catch(() => addToast({ type: 'error', title: 'Erro', description: 'Falha ao carregar produtos' }))
    }, [addToast])

    async function deleteProduct(id: string | number) {
        try {
            await api.delete(`/products/${id}`)
            setProducts((lista) => lista.filter((product) => product.id !== id))
            addToast({ type: 'success', title: 'Sucesso', description: 'Produto removido.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Não foi possível remover o produto.' })
        }
    }

    async function addProduct(produto: NovoProduto) {
        try {
            const response = await api.post('/products', produto)
            setProducts((lista) => [...lista, response.data])
            addToast({ type: 'success', title: 'Sucesso', description: 'Produto criado.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao criar produto.' })
        }
    }

    async function updateProduct(produtoAtualizado: IProduto) {
        try {
            const response = await api.put(`/products/${produtoAtualizado.id}`, produtoAtualizado)
            setProducts((lista) =>
                lista.map((produto) =>
                    produto.id === produtoAtualizado.id ? response.data : produto
                )
            )
            addToast({ type: 'success', title: 'Sucesso', description: 'Produto atualizado.' })
        } catch (error) {
            addToast({ type: 'error', title: 'Erro', description: 'Falha ao atualizar produto.' })
        }
    }

    return (
        <ProductContext.Provider value={{ products, deleteProduct, addProduct, updateProduct }}>
            {children}
        </ProductContext.Provider>
    )
}

export function useProducts() {
    return useContext(ProductContext)
}