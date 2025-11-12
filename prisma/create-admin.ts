import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 Criando usuário admin padrão...');

  // Criar usuário admin
  const adminEmail = 'admin@vaquejada.com';
  const adminPassword = 'admin123'; // Senha padrão (alterar em produção!)

  try {
    // Verificar se admin já existe
    const existing = await prisma.usuario.findUnique({
      where: { email: adminEmail },
    });

    if (existing) {
      console.log('✅ Admin já existe:', adminEmail);
      console.log('💡 Para atualizar a senha, delete o usuário e execute novamente este script.');
      return;
    }

    // VULN-001 CORRIGIDA: Usar bcrypt para hash da senha
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Criar admin
    const admin = await prisma.usuario.create({
      data: {
        email: adminEmail,
        name: 'Administrador',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin criado com sucesso!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Senha:', adminPassword);
    console.log('⚠️  IMPORTANTE: Altere a senha em produção!');
    console.log('⚠️  A senha foi hasheada com bcrypt.');
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

