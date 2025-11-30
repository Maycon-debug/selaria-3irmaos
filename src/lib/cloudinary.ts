import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary com as credenciais do ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Faz upload de uma imagem para o Cloudinary
 * @param imageData - Base64 ou URL da imagem
 * @param folder - Pasta onde salvar (ex: 'produtos')
 * @param removeBackground - Se true, remove o fundo da imagem automaticamente (usar para logos)
 * @returns URL pública da imagem no Cloudinary
 */
export async function uploadImage(
  imageData: string,
  folder: string = 'produtos',
  removeBackground: boolean = false
): Promise<string> {
  try {
    // Verificar se Cloudinary está configurado
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary não está configurado. Verifique as variáveis de ambiente.');
    }

    // Se já é uma URL do Cloudinary, retorna direto
    if (imageData.startsWith('http') && imageData.includes('cloudinary.com')) {
      return imageData;
    }

    // Validar formato base64
    if (!imageData.startsWith('data:image/')) {
      throw new Error('Formato de imagem inválido. Use uma imagem válida.');
    }

    // Configurações base de upload
    // Para logos, usar tamanho ideal para visualização (400x400 é ideal para logos)
    const isLogo = folder === 'logo';
    const maxSize = isLogo ? 800 : 1200; // Logos menores para melhor performance
    
    const uploadOptions: any = {
      folder: folder,
      resource_type: 'image',
      transformation: [
        {
          width: maxSize,
          height: maxSize,
          crop: 'limit', // Limita tamanho mas mantém proporção
          quality: 'auto', // Otimiza qualidade automaticamente
          fetch_format: isLogo && removeBackground ? 'png' : 'auto', // PNG mantém transparência se remover fundo
        },
      ],
    };

    // Se remoção de fundo está habilitada, adicionar transformação
    if (removeBackground) {
      uploadOptions.transformation = [
        {
          effect: 'background_removal', // Addon do Cloudinary para remoção de fundo
          quality: 'auto',
          fetch_format: 'png', // PNG mantém transparência
        },
        {
          width: maxSize,
          height: maxSize,
          crop: 'limit',
        },
      ];
    }

    // Se é uma URL local (base64), faz upload
    const result = await cloudinary.uploader.upload(imageData, uploadOptions);

    if (!result?.secure_url) {
      throw new Error('Upload concluído mas URL não foi retornada');
    }

    return result.secure_url; // Retorna URL HTTPS
  } catch (error: any) {
    console.error('Erro ao fazer upload para Cloudinary:', error);
    
    // Mensagens de erro mais específicas
    if (error?.http_code === 401) {
      throw new Error('Credenciais do Cloudinary inválidas. Verifique CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no arquivo .env.local');
    }
    
    // Erro específico para remoção de fundo não disponível
    if (error?.http_code === 400 && removeBackground) {
      throw new Error('Remoção de fundo não disponível. Verifique se o addon Background Removal está habilitado na sua conta Cloudinary.');
    }
    
    if (error?.message) {
      throw error; // Re-lançar erro com mensagem já formatada
    }
    
    throw new Error(`Falha ao fazer upload: ${error?.message || 'Erro desconhecido'}`);
  }
}

/**
 * Deleta uma imagem do Cloudinary usando a URL
 * @param imageUrl - URL da imagem no Cloudinary
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extrair public_id da URL
    // Exemplo: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg
    // public_id seria: folder/image
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      throw new Error('URL inválida do Cloudinary');
    }

    // Pegar tudo depois de 'upload' e antes do último segmento (que é o nome do arquivo)
    const pathAfterUpload = urlParts.slice(uploadIndex + 2); // +2 porque pula 'upload' e versão 'v1234567890'
    const publicId = pathAfterUpload.join('/').replace(/\.[^/.]+$/, ''); // Remove extensão

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Erro ao deletar imagem do Cloudinary:', error);
    // Não lança erro para não quebrar o fluxo se a imagem não existir
  }
}

