import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

// Carregar variáveis de ambiente
config({ path: '.env.local' });

const prisma = new PrismaClient();

// Função auxiliar para converter preço de string para Decimal
function parsePrice(priceString: string): number {
  return parseFloat(
    priceString
      .replace('R$', '')
      .replace('.', '')
      .replace(',', '.')
      .trim()
  );
}

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Produtos do carrossel
  const carouselProducts = [
    {
      name: 'Sela Vaquejada Premium',
      description:
        'Sela de vaquejada artesanal com couro legítimo de primeira qualidade. Design ergonômico para máximo conforto e segurança durante as competições. Perfeita para atletas profissionais e amadores.',
      price: parsePrice('R$ 1.899,00'),
      originalPrice: null,
      category: 'Selas',
      rating: 4.8,
      image: '/images/products/carousel/sela01.jpeg',
      stock: 10,
    },
    {
      name: 'Peitoral e Cia',
      description:
        'Peitoral completo para vaquejada com acabamento em couro legítimo. Conjunto completo com todas as peças necessárias para montaria profissional. Resistente e durável para uso intensivo.',
      price: parsePrice('R$ 1.499,00'),
      originalPrice: null,
      category: 'Equipamentos',
      rating: 4.9,
      image: '/images/products/carousel/sela02.jpeg',
      stock: 8,
    },
    {
      name: 'Espora Profissional',
      description:
        'Espora de alta qualidade para vaquejada, fabricada com materiais premium. Design ergonômico e seguro, proporcionando controle preciso durante as competições. Disponível em vários tamanhos.',
      price: parsePrice('R$ 349,00'),
      originalPrice: null,
      category: 'Equipamentos',
      rating: 4.7,
      image: '/images/hero/espora01.jpeg',
      stock: 25,
    },
    {
      name: 'Cabeçada Vaquejada',
      description:
        'Cabeçada profissional para vaquejada em couro nobre. Acabamento impecável e design tradicional. Perfeita para controle e direcionamento do cavalo durante as competições.',
      price: parsePrice('R$ 599,00'),
      originalPrice: null,
      category: 'Equipamentos',
      rating: 4.8,
      image: '/images/products/grid/cabeçada01.jpeg',
      stock: 15,
    },
    {
      name: 'Cabresto Premium',
      description:
        'Cabresto de couro legítimo para vaquejada. Resistente e confortável para o cavalo. Design clássico com detalhes artesanais. Essencial para o manejo adequado do animal.',
      price: parsePrice('R$ 449,00'),
      originalPrice: null,
      category: 'Equipamentos',
      rating: 4.6,
      image: '/images/products/grid/cabresto01.jpeg',
      stock: 20,
    },
    {
      name: 'Luva para Cavalo',
      description:
        'Luva especializada para proteção e cuidado do cavalo. Confeccionada em material de alta qualidade, oferece proteção e conforto durante o treinamento e competições.',
      price: parsePrice('R$ 199,00'),
      originalPrice: null,
      category: 'Equipamentos',
      rating: 4.5,
      image: '/images/products/grid/luvaCavalo01.jpeg',
      stock: 30,
    },
    {
      name: 'Capacete Vaquejada',
      description:
        'Capacete de segurança profissional para vaquejada. Certificado e aprovado para competições. Design moderno com ventilação adequada e sistema de ajuste seguro.',
      price: parsePrice('R$ 399,00'),
      originalPrice: null,
      category: 'Segurança',
      rating: 4.9,
      image: '/images/products/grid/capacete01.jpg',
      stock: 18,
    },
    {
      name: 'Rédea Premium',
      description:
        'Rédea de couro legítimo para vaquejada. Acabamento artesanal e durabilidade excepcional. Controle preciso e conforto nas mãos. Disponível em várias cores e estilos.',
      price: parsePrice('R$ 299,00'),
      originalPrice: null,
      category: 'Equipamentos',
      rating: 4.7,
      image: '/images/products/carousel/sela03.jpeg',
      stock: 22,
    },
  ];

  // Produtos do grid
  const gridProducts = [
    {
      name: 'Sela Vaquejada Premium',
      description: 'Sela artesanal com couro legítimo de primeira qualidade',
      price: parsePrice('R$ 1.899,00'),
      originalPrice: parsePrice('R$ 2.299,00'),
      category: 'Selas',
      rating: 4.8,
      image: '/images/products/carousel/sela04.jpeg',
      stock: 10,
    },
    {
      name: 'Peitoral e Cia Completo',
      description: 'Peitoral completo para vaquejada com acabamento em couro legítimo.',
      price: parsePrice('R$ 1.499,00'),
      originalPrice: null,
      category: 'Equipamentos',
      rating: 4.9,
      image: '/images/products/carousel/sela05.jpeg',
      stock: 8,
    },
    {
      name: 'Espora Profissional',
      description: 'Espora de alta qualidade para vaquejada, fabricada com materiais premium.',
      price: parsePrice('R$ 349,00'),
      originalPrice: null,
      category: 'Equipamentos',
      rating: 4.7,
      image: '/images/hero/espora02.jpeg',
      stock: 25,
    },
    {
      name: 'Cabeçada Vaquejada',
      description: 'Cabeçada profissional para vaquejada em couro nobre.',
      price: parsePrice('R$ 599,00'),
      originalPrice: null,
      category: 'Equipamentos',
      rating: 4.8,
      image: '/images/products/grid/cabeçada01.jpeg',
      stock: 15,
    },
    {
      name: 'Cabresto Premium',
      description: 'Cabresto de couro legítimo para vaquejada.',
      price: parsePrice('R$ 449,00'),
      originalPrice: null,
      category: 'Equipamentos',
      rating: 4.6,
      image: '/images/products/grid/cabresto01.jpeg',
      stock: 20,
    },
    {
      name: 'Luva para Cavalo',
      description: 'Luva especializada para proteção e cuidado do cavalo.',
      price: parsePrice('R$ 199,00'),
      originalPrice: null,
      category: 'Equipamentos',
      rating: 4.5,
      image: '/images/products/grid/luvaCavalo01.jpeg',
      stock: 30,
    },
    {
      name: 'Capacete Vaquejada',
      description: 'Capacete de segurança profissional para vaquejada.',
      price: parsePrice('R$ 399,00'),
      originalPrice: null,
      category: 'Segurança',
      rating: 4.9,
      image: '/images/products/grid/capacete01.jpg',
      stock: 18,
    },
    {
      name: 'Rédea Premium',
      description: 'Rédea de couro legítimo para vaquejada.',
      price: parsePrice('R$ 299,00'),
      originalPrice: null,
      category: 'Equipamentos',
      rating: 4.7,
      image: '/images/products/carousel/sela06.jpeg',
      stock: 22,
    },
    {
      name: 'Arreio Vaquejada Artesanal',
      description: 'Arreio completo para vaquejada com acabamento artesanal.',
      price: parsePrice('R$ 899,00'),
      originalPrice: null,
      category: 'Arreios',
      rating: 4.9,
      image: '/images/products/carousel/sela07.jpeg',
      stock: 12,
    },
    {
      name: 'Bota Vaquejada Clássica',
      description: 'Bota tradicional para vaquejada com couro legítimo.',
      price: parsePrice('R$ 649,00'),
      originalPrice: null,
      category: 'Botas',
      rating: 4.7,
      image: '/images/products/grid/bota01.jpeg',
      stock: 20,
    },
    {
      name: 'Sela Vaquejada Esportiva',
      description: 'Sela esportiva para vaquejada com design moderno.',
      price: parsePrice('R$ 2.199,00'),
      originalPrice: null,
      category: 'Selas',
      rating: 4.6,
      image: '/images/products/carousel/sela08.jpeg',
      stock: 7,
    },
    {
      name: 'Bota Vaquejada Premium',
      description: 'Bota premium para vaquejada com acabamento superior.',
      price: parsePrice('R$ 799,00'),
      originalPrice: parsePrice('R$ 999,00'),
      category: 'Botas',
      rating: 4.8,
      image: '/images/products/grid/bota02.jpeg',
      stock: 15,
    },
    {
      name: 'Bota Vaquejada Esportiva',
      description: 'Bota esportiva para vaquejada com tecnologia avançada.',
      price: parsePrice('R$ 749,00'),
      originalPrice: null,
      category: 'Botas',
      rating: 4.7,
      image: '/images/products/grid/bota03.jpeg',
      stock: 18,
    },
    {
      name: 'Sela Vaquejada Artesanal',
      description: 'Sela artesanal premium para vaquejada.',
      price: parsePrice('R$ 2.499,00'),
      originalPrice: null,
      category: 'Selas',
      rating: 4.9,
      image: '/images/products/carousel/sela09.jpeg',
      stock: 5,
    },
    {
      name: 'Bota Vaquejada Tradicional',
      description: 'Bota tradicional para vaquejada com design clássico.',
      price: parsePrice('R$ 549,00'),
      originalPrice: null,
      category: 'Botas',
      rating: 4.6,
      image: '/images/products/grid/bota04.jpeg',
      stock: 25,
    },
    {
      name: 'Sela Vaquejada Deluxe',
      description: 'Sela deluxe para vaquejada com acabamento premium.',
      price: parsePrice('R$ 2.799,00'),
      originalPrice: null,
      category: 'Selas',
      rating: 5.0,
      image: '/images/products/carousel/sela10.jpeg',
      stock: 3,
    },
  ];

  // Combinar todos os produtos (removendo duplicatas por nome)
  const allProducts = [...carouselProducts, ...gridProducts];
  const uniqueProducts = Array.from(
    new Map(allProducts.map((p) => [p.name, p])).values()
  );

  console.log(`📦 Criando ${uniqueProducts.length} produtos...`);

  for (const productData of uniqueProducts) {
    const { stock, ...product } = productData;

    // Verificar se produto já existe
    const existing = await prisma.produto.findFirst({
      where: { name: product.name },
    });

    if (existing) {
      console.log(`⏭️  ${product.name} já existe, pulando...`);
      continue;
    }

    const created = await prisma.produto.create({
      data: {
        ...product,
        stock: stock || 0,
      },
    });

    console.log(`✅ ${created.name} - ID: ${created.id}`);
  }

  console.log('✨ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

