export interface IProduto {
  id: string | number;
  nome: string;
  precoAtual: number;
  precoPromocional: number | null;
  tipo: string;
  descricao: string;
  dataValidade: string;
}

export interface IUsuario {
  id: string | number;
  nome: string;
  email: string;
  senha?: string;
  cpf: string;
}

export interface ICliente {
  id: number;
  nome: string;
  identidade: string;
  idade: number;
  tempoCliente: number;
}