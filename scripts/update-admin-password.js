// Script para atualizar senha do admin para bcrypt
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  try {
    console.log('🔐 Atualizando senha do admin para bcrypt...\n');
    
    const adminEmail = 'admin@vaquejada.com';
    const adminPassword = 'admin123';
    
    // Buscar admin
    const admin = await prisma.usuario.findUnique({
      where: { email: adminEmail },
    });
    
    if (!admin) {
      console.log('❌ Admin não encontrado!');
      return;
    }
    
    console.log(`✅ Admin encontrado: ${admin.email}`);
    
    // Gerar hash da senha
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    console.log('✅ Senha hasheada gerada');
    
    // Atualizar senha
    await prisma.usuario.update({
      where: { email: adminEmail },
      data: { password: hashedPassword },
    });
    
    console.log('✅ Senha atualizada com sucesso!');
    console.log('\n📧 Email: admin@vaquejada.com');
    console.log('🔑 Senha: admin123');
    console.log('\n⚠️  A senha agora está hasheada com bcrypt.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();

