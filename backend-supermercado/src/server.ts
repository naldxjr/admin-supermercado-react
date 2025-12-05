import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

function isCpfValid(cpf: string) {
  const strCPF = cpf.replace(/[^\d]+/g, '')
  if (strCPF.length !== 11) return false
  if (/^(\d)\1+$/.test(strCPF)) return false

  let soma = 0, resto
  for (let i = 1; i <= 9; i++) soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i)
  resto = (soma * 10) % 11
  if ((resto === 10) || (resto === 11)) resto = 0
  if (resto !== parseInt(strCPF.substring(9, 10))) return false

  soma = 0
  for (let i = 1; i <= 10; i++) soma += parseInt(strCPF.substring(i - 1, i)) * (12 - i)
  resto = (soma * 10) % 11
  if ((resto === 10) || (resto === 11)) resto = 0
  if (resto !== parseInt(strCPF.substring(10, 11))) return false

  return true
}

const app = express()
const prisma = new PrismaClient()
const upload = multer({ dest: 'uploads/' })
const SECRET_KEY = 'minha_chave_secreta_super_segura'



app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

app.delete('/users/:id/avatar', async (req, res) => {
  const { id } = req.params

  try {

    const user = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { avatarUrl: null }
    })

    const { senha: _, ...userSemSenha } = user
    return res.json(userSemSenha)

  } catch (error) {
    return res.status(400).json({ error: 'Erro ao remover a foto de perfil.' })
  }
})

app.post('/login', async (req, res) => {
  const { email, senha } = req.body

  const user = await prisma.usuario.findUnique({ where: { email } })

  if (!user) {
    return res.status(400).json({ error: 'Usuário ou senha inválidos' })
  }

  const senhaValida = await bcrypt.compare(senha, user.senha)

  if (!senhaValida) {
    return res.status(400).json({ error: 'Usuário ou senha inválidos' })
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1d' })
  const { senha: _, ...userSemSenha } = user

  return res.json({ user: userSemSenha, token })
})

app.get('/products', async (req, res) => {
  const products = await prisma.produto.findMany()
  return res.json(products)
})

app.post('/products', async (req, res) => {
  const { nome, precoAtual, precoPromocional, tipo, descricao, dataValidade } = req.body

  const product = await prisma.produto.create({
    data: {
      nome,
      precoAtual: Number(precoAtual),
      precoPromocional: precoPromocional ? Number(precoPromocional) : null,
      tipo,
      descricao,
      dataValidade
    }
  })

  return res.json(product)
})

app.put('/products/:id', async (req, res) => {
  const { id } = req.params
  const { nome, precoAtual, precoPromocional, tipo, descricao, dataValidade } = req.body

  const product = await prisma.produto.update({
    where: { id: Number(id) },
    data: {
      nome,
      precoAtual: Number(precoAtual),
      precoPromocional: precoPromocional ? Number(precoPromocional) : null,
      tipo,
      descricao,
      dataValidade
    }
  })

  return res.json(product)
})

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params
  await prisma.produto.delete({ where: { id: Number(id) } })
  return res.sendStatus(204)
})

app.get('/users', async (req, res) => {
  const users = await prisma.usuario.findMany()
  const usersSemSenha = users.map(user => {
    const { senha, ...rest } = user
    return rest
  })
  return res.json(usersSemSenha)
})

app.post('/users', async (req, res) => {
  const { nome, email, senha, cpf } = req.body

  const hashSenha = await bcrypt.hash(senha, 10)

  try {
    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashSenha,
        cpf
      }
    })
    const { senha: _, ...userSemSenha } = user
    return res.json(userSemSenha)
  } catch (err) {
    return res.status(400).json({ error: 'Email ou CPF já cadastrados' })
  }
})

app.put('/users/:id', async (req, res) => {
  const { id } = req.params
  const { nome, email, cpf, senha } = req.body

  if (cpf && !isCpfValid(cpf)) {
    return res.status(400).json({ error: 'CPF Inválido' })
  }

  const data: any = { nome, email, cpf }

  if (senha) {
    data.senha = await bcrypt.hash(senha, 10)
  }

  try {
    const user = await prisma.usuario.update({
      where: { id: Number(id) },
      data
    })
    const { senha: _, ...userSemSenha } = user
    return res.json(userSemSenha)
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao atualizar. Email ou CPF duplicado.' })
  }
})

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params
  await prisma.usuario.delete({ where: { id: Number(id) } })
  return res.sendStatus(204)
})

app.post('/users/:id/avatar', upload.single('avatar'), async (req, res) => {
  const { id } = req.params

  if (!req.file) {
    return res.status(400).json({ error: 'Arquivo não enviado' })
  }

  const avatarUrl = `http://localhost:3333/uploads/${req.file.filename}`

  const user = await prisma.usuario.update({
    where: { id: Number(id) },
    data: { avatarUrl }
  })

  return res.json({ avatarUrl })
})

app.get('/clients', async (req, res) => {
  const clients = await prisma.cliente.findMany()
  return res.json(clients)
})

app.post('/clients', async (req, res) => {
  const { nome, identidade, idade, tempoCliente } = req.body
  try {
    const client = await prisma.cliente.create({
      data: { nome, identidade, idade: Number(idade), tempoCliente: Number(tempoCliente) }
    })
    return res.json(client)
  } catch (err) {
    return res.status(400).json({ error: 'Cliente já existe' })
  }
})

app.put('/clients/:id', async (req, res) => {
  const { id } = req.params
  const { nome, identidade, idade, tempoCliente } = req.body
  const client = await prisma.cliente.update({
    where: { id: Number(id) },
    data: { nome, identidade, idade: Number(idade), tempoCliente: Number(tempoCliente) }
  })
  return res.json(client)
})

app.delete('/clients/:id', async (req, res) => {
  const { id } = req.params
  await prisma.cliente.delete({ where: { id: Number(id) } })
  return res.sendStatus(204)
})

app.post('/recover-password', async (req, res) => {
  const { email, cpf, novaSenha } = req.body

  try {
    const user = await prisma.usuario.findFirst({
      where: {
        email: email,
        cpf: cpf
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Dados incorretos. Verifique o Email e CPF.' })
    }
    const hashSenha = await bcrypt.hash(novaSenha, 10)

    await prisma.usuario.update({
      where: { id: user.id },
      data: { senha: hashSenha }
    })

    return res.json({ message: 'Senha alterada com sucesso!' })

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar solicitação.' })
  }
})

app.listen(3333, () => {
  console.log('Server running on port 3333')
})

