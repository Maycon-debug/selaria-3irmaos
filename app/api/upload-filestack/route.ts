import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../auth/login/route';

/**
 * API Route para fazer upload de imagens para o Filestack
 * 
 * COMO FUNCIONA:
 * 1. Frontend envia imagem (base64)
 * 2. Esta API valida se usuário é admin
 * 3. Faz upload para Filestack usando API REST
 * 4. Retorna URL pública da imagem
 */

export async function POST(request: NextRequest) {
  try {
    // 1. VERIFICAR AUTENTICAÇÃO ADMIN
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
    const { imageData } = body;

    if (!imageData) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    // 3. OBTER API KEY DO FILESTACK
    const filestackApiKey = process.env.FILESTACK_API_KEY;
    
    if (!filestackApiKey) {
      return NextResponse.json(
        { error: 'Filestack API Key não configurada' },
        { status: 500 }
      );
    }

    // 4. FAZER UPLOAD PARA FILESTACK
    // Filestack aceita base64 diretamente via API REST
    // Usando a API: https://www.filestackapi.com/api/store/S3
    
    // Converter base64 para formato que Filestack aceita
    const base64Data = imageData.includes(',') 
      ? imageData.split(',')[1] // Remove data:image/jpeg;base64,
      : imageData;
    
    // Converter base64 para Buffer
    const binaryData = Buffer.from(base64Data, 'base64');
    
    // Criar FormData usando node-fetch ou multipart/form-data
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('fileUpload', binaryData, {
      filename: 'image.jpg',
      contentType: 'image/jpeg',
    });

    const uploadUrl = `https://www.filestackapi.com/api/store/S3?key=${filestackApiKey}`;

    const filestackResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData as any,
      headers: formData.getHeaders(),
    });

    if (!filestackResponse.ok) {
      const errorText = await filestackResponse.text();
      console.error('Erro Filestack:', errorText);
      throw new Error('Erro ao fazer upload para Filestack');
    }

    const filestackData = await filestackResponse.json();
    
    // Filestack retorna handle no formato: { handle: "abc123xyz" }
    // URL final: https://cdn.filestackapi.com/API_KEY/handle
    const handle = filestackData.handle || filestackData.url;
    
    if (!handle) {
      console.error('Resposta Filestack:', filestackData);
      throw new Error('Handle não retornado pelo Filestack');
    }

    const imageUrl = `https://cdn.filestackapi.com/${filestackApiKey}/${handle}`;

    // 5. RETORNAR URL PÚBLICA
    return NextResponse.json({
      url: imageUrl,
      success: true,
    });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload da imagem' },
      { status: 500 }
    );
  }
}

