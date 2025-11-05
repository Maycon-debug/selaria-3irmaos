/**
 * Script para migrar todas as imagens da pasta public/images/ para o Cloudinary
 * 
 * O QUE ESTE SCRIPT FAZ:
 * 1. Encontra todas as imagens na pasta public/images/
 * 2. Faz upload de cada uma para o Cloudinary
 * 3. Atualiza os produtos no banco de dados com as novas URLs do Cloudinary
 * 4. Mantém a estrutura de pastas organizada
 * 
 * COMO USAR:
 * npm run migrate-images
 */

import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

// Carregar variáveis de ambiente
config({ path: '.env.local' });

const prisma = new PrismaClient();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface ImageFile {
  localPath: string;
  relativePath: string;
  cloudinaryPath: string;
}

/**
 * Encontrar todas as imagens na pasta public/images/
 */
function findImages(dir: string, baseDir: string = ''): ImageFile[] {
  const images: ImageFile[] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursivamente buscar em subpastas
      const subDir = path.join(baseDir, file);
      images.push(...findImages(filePath, subDir));
    } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
      // É uma imagem
      const relativePath = baseDir ? `${baseDir}/${file}` : file;
      // Normalizar caminho (converter \ para / no Windows)
      const normalizedRelativePath = relativePath.replace(/\\/g, '/');
      const localPath = `/images/${normalizedRelativePath}`;
      
      // Criar caminho no Cloudinary mantendo estrutura
      // Exemplo: /images/products/carousel/sela01.jpeg
      // Vira: produtos/carousel/sela01 (sem extensão)
      const cloudinaryPath = normalizedRelativePath
        .replace(/^images\//, '') // Remove 'images/' do início
        .replace(/\.[^/.]+$/, ''); // Remove extensão

      images.push({
        localPath,
        relativePath: normalizedRelativePath,
        cloudinaryPath,
      });
    }
  }

  return images;
}

/**
 * Converter imagem local para base64
 */
function imageToBase64(filePath: string): string {
  const fullPath = path.join(process.cwd(), 'public', filePath);
  const imageBuffer = fs.readFileSync(fullPath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mimeType = ext === 'jpg' ? 'jpeg' : ext;
  return `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
}

/**
 * Fazer upload de uma imagem para o Cloudinary
 */
async function uploadToCloudinary(
  imageData: string,
  folder: string,
  publicId: string
): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(imageData, {
      folder: folder,
      public_id: publicId,
      resource_type: 'image',
      overwrite: false, // Não sobrescrever se já existir
      transformation: [
        {
          width: 1200,
          height: 1200,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto',
        },
      ],
    });

    return result.secure_url;
  } catch (error: any) {
    console.error(`Erro ao fazer upload de ${publicId}:`, error.message);
    throw error;
  }
}

/**
 * Atualizar produtos no banco de dados com nova URL
 */
async function updateProductImage(oldUrl: string, newUrl: string): Promise<number> {
  try {
    const result = await prisma.produto.updateMany({
      where: {
        image: oldUrl,
      },
      data: {
        image: newUrl,
      },
    });

    return result.count;
  } catch (error) {
    console.error(`Erro ao atualizar produto com imagem ${oldUrl}:`, error);
    return 0;
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando migração de imagens para Cloudinary...\n');

  // Verificar se Cloudinary está configurado
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ ERRO: Cloudinary não está configurado!');
    console.error('Verifique as variáveis CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no .env.local');
    process.exit(1);
  }

  // Encontrar todas as imagens
  console.log('📁 Procurando imagens na pasta public/images/...');
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  
  if (!fs.existsSync(imagesDir)) {
    console.error('❌ Pasta public/images/ não encontrada!');
    process.exit(1);
  }

  const images = findImages(imagesDir);
  console.log(`✅ Encontradas ${images.length} imagens\n`);

  if (images.length === 0) {
    console.log('ℹ️  Nenhuma imagem encontrada para migrar.');
    process.exit(0);
  }

  // Estatísticas
  let successCount = 0;
  let errorCount = 0;
  let updatedProducts = 0;
  const errors: string[] = [];

  // Processar cada imagem
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const progress = `[${i + 1}/${images.length}]`;

    try {
      console.log(`${progress} Processando: ${image.localPath}`);

      // Converter para base64
      const imageData = imageToBase64(image.localPath);

      // Extrair pasta do caminho
      // Exemplo: produtos/carousel/sela01 -> pasta: produtos, publicId: carousel/sela01
      // Normalizar caminho para garantir que use apenas /
      const normalizedPath = image.cloudinaryPath.replace(/\\/g, '/');
      const pathParts = normalizedPath.split('/');
      const folder = pathParts[0] || 'produtos';
      const publicId = pathParts.slice(1).join('/') || pathParts[0];

      // Fazer upload
      const cloudinaryUrl = await uploadToCloudinary(imageData, folder, publicId);
      console.log(`   ✅ Upload concluído: ${cloudinaryUrl}`);

      // Atualizar produtos no banco
      const updated = await updateProductImage(image.localPath, cloudinaryUrl);
      if (updated > 0) {
        console.log(`   📦 ${updated} produto(s) atualizado(s) no banco`);
        updatedProducts += updated;
      }

      successCount++;
    } catch (error: any) {
      errorCount++;
      const errorMsg = `Erro ao processar ${image.localPath}: ${error.message}`;
      errors.push(errorMsg);
      console.error(`   ❌ ${errorMsg}`);
    }

    console.log(''); // Linha em branco para separar
  }

  // Relatório final
  console.log('\n' + '='.repeat(50));
  console.log('📊 RELATÓRIO FINAL');
  console.log('='.repeat(50));
  console.log(`✅ Sucesso: ${successCount} imagens`);
  console.log(`❌ Erros: ${errorCount} imagens`);
  console.log(`📦 Produtos atualizados: ${updatedProducts}`);
  
  if (errors.length > 0) {
    console.log('\n❌ Erros encontrados:');
    errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }

  console.log('\n✨ Migração concluída!');
  console.log('\n💡 PRÓXIMOS PASSOS:');
  console.log('   1. Verifique as imagens no Cloudinary Dashboard');
  console.log('   2. Teste criando um produto novo');
  console.log('   3. As imagens antigas ainda estão em public/images/ (você pode deletar depois)');
}

// Executar
main()
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

