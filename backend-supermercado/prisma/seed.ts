import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10)

  await prisma.usuario.upsert({
    where: { email: 'admin@mercado.com' },
    update: {},
    create: {
      nome: 'Admin Mestre',
      email: 'admin@mercado.com',
      senha: passwordHash,
      cpf: '000.000.000-00',
    },
  })

  console.log('Usuário Admin criado com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })