import type { IProduto, IUsuario } from "../types";

export const MOCK_PRODUTOS: IProduto[] = [
    {
        id: 1,
        nome: "Leite Integral 1L",
        precoAtual: 5.49,
        precoPromocional: null,
        tipo: "Laticínio",
        descricao: "Leite integral longa vida de alta qualidade.",
        dataValidade: "2025-12-20",
    },
    {
        id: 2,
        nome: "Pão de Forma Tradicional 500g",
        precoAtual: 7.99,
        precoPromocional: 6.99,
        tipo: "Padaria",
        descricao: "Pão de forma macio e saboroso, ideal para sanduíches.",
        dataValidade: "2025-11-10",
    },
    {
        id: 3,
        nome: "Maçã Fuji (Kg)",
        precoAtual: 9.98,
        precoPromocional: null,
        tipo: "Hortifruti",
        descricao: "Maçã fuji fresca e suculenta, vendida por quilo.",
        dataValidade: "2025-11-15",
    },
];

export const MOCK_USUARIOS: IUsuario[] = [
    {
        id: 101,
        nome: 'Admin Mestre',
        email: 'admin@mercado.com',
        cpf: '111.222.333-44',
    },
    {
        id: 102,
        nome: 'EU',
        email: 'eu@mercado.com',
        cpf: '222.333.444-55',
    },
    {
        id: 103,
        nome: 'Lídia Repositora',
        email: 'lídia.repo@mercado.com',
        cpf: '333.444.555-66',
    },
]