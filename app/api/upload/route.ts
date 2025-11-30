import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/src/lib/cloudinary';
import { verifyToken } from '../auth/login/route';

/**
 * API Route para fazer upload de imagens para o Cloudinary
 * 
 * POR QUE ESTA ROTA EXISTE?
 * - Não podemos fazer upload direto do frontend para Cloudinary por segurança
 * - Precisamos validar autenticação admin antes de permitir upload
 * - Processamos a imagem no servidor antes de enviar
 * 
 * COMO FUNCIONA:
 * 1. Frontend envia imagem (base64 ou URL)
 * 2. Esta API valida se usuário é admin
 * 3. Faz upload para Cloudinary
 * 4. Retorna URL pública da imagem
 */

export async function POST(request: NextRequest) {
  try {
    // 1. VERIFICAR AUTENTICAÇÃO ADMIN
    // Por que? Precisamos garantir que apenas admins podem fazer upload
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Apenas administradores podem fazer upload' },
        { status: 403 }
      );
    }

    // 2. RECEBER DADOS DA IMAGEM
    const body = await request.json();
    const { imageData, folder, removeBackground } = body;

    if (!imageData) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    // 3. VERIFICAR SE CLOUDINARY ESTÁ CONFIGURADO
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary não está configurado. Verifique as variáveis de ambiente CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.' },
        { status: 500 }
      );
    }

    // 4. FAZER UPLOAD PARA CLOUDINARY
    // Esta função está em src/lib/cloudinary.ts
    // Se folder é 'logo', automaticamente remove o fundo
    const shouldRemoveBackground = removeBackground === true || folder === 'logo';
    const imageUrl = await uploadImage(imageData, folder || 'produtos', shouldRemoveBackground);

    // 4. RETORNAR URL PÚBLICA
    return NextResponse.json({
      url: imageUrl,
      success: true,
    });
  } catch (error: any) {
    console.error('Erro ao fazer upload:', error);
    
    // Mensagens de erro mais específicas
    let errorMessage = 'Erro ao fazer upload da imagem';
    
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.http_code) {
      // Erro do Cloudinary
      switch (error.http_code) {
        case 401:
          errorMessage = 'Credenciais do Cloudinary inválidas. Verifique suas configurações.';
          break;
        case 400:
          errorMessage = 'Formato de imagem inválido ou muito grande.';
          break;
        default:
          errorMessage = `Erro do Cloudinary: ${error.message || 'Erro desconhecido'}`;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

