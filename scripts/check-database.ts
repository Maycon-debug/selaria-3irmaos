// Script para verificar se os dados estão sendo salvos no banco
// Execute: npx tsx scripts/check-database.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Verificando banco de dados...\n')

    // Contar registros em cada tabela
    const usuarios = await prisma.usuario.count()
    const produtos = await prisma.produto.count()
    const mensagens = await prisma.mensagemContato.count()
    const carrinhoItems = await prisma.carrinhoItem.count()
    const favoritos = await prisma.favorito.count()
    const pedidos = await prisma.pedido.count()
    const orders = await prisma.order.count()
    const accounts = await prisma.account.count()
    const sessions = await prisma.session.count()

    console.log('📊 ESTATÍSTICAS DO BANCO DE DADOS:\n')
    console.log(`✅ Usuários: ${usuarios}`)
    console.log(`✅ Produtos: ${produtos}`)
    console.log(`✅ Mensagens de Contato: ${mensagens}`)
    console.log(`✅ Itens no Carrinho: ${carrinhoItems}`)
    console.log(`✅ Favoritos: ${favoritos}`)
    console.log(`✅ Pedidos (antigos): ${pedidos}`)
    console.log(`✅ Pedidos (novos): ${orders}`)
    console.log(`✅ Contas OAuth: ${accounts}`)
    console.log(`✅ Sessões: ${sessions}`)

    // Ver últimas mensagens
    if (mensagens > 0) {
      console.log('\n📧 ÚLTIMAS MENSAGENS DE CONTATO:')
      const ultimasMensagens = await prisma.mensagemContato.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          subject: true,
          status: true,
          createdAt: true,
        }
      })
      ultimasMensagens.forEach((msg, index) => {
        console.log(`  ${index + 1}. ${msg.name} - ${msg.subject} (${msg.status}) - ${msg.createdAt.toLocaleDateString('pt-BR')}`)
      })
    }

    // Ver últimos produtos
    if (produtos > 0) {
      console.log('\n📦 ÚLTIMOS PRODUTOS CADASTRADOS:')
      const ultimosProdutos = await prisma.produto.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          stock: true,
          createdAt: true,
        }
      })
      ultimosProdutos.forEach((prod, index) => {
        console.log(`  ${index + 1}. ${prod.name} - ${prod.category} - R$ ${prod.price} - Estoque: ${prod.stock}`)
      })
    }

    // Verificar se há dados de teste
    console.log('\n🧪 VERIFICAÇÕES:')
    
    if (usuarios === 0) {
      console.log('⚠️  Nenhum usuário cadastrado')
    } else {
      console.log('✅ Usuários encontrados')
    }

    if (produtos === 0) {
      console.log('⚠️  Nenhum produto cadastrado')
    } else {
      console.log('✅ Produtos encontrados')
    }

    if (mensagens === 0) {
      console.log('⚠️  Nenhuma mensagem de contato')
    } else {
      console.log('✅ Mensagens de contato encontradas')
    }

    if (carrinhoItems === 0) {
      console.log('ℹ️  Nenhum item no carrinho (pode estar usando localStorage)')
    } else {
      console.log('✅ Itens no carrinho encontrados')
    }

    console.log('\n✅ Verificação concluída!')
    console.log('\n💡 Dica: Use "npm run db:studio" para ver os dados visualmente')

  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()

