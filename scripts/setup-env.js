// Script para configurar variáveis de ambiente necessárias
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

// Ler arquivo existente se houver
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Gerar segredos se não existirem
function getOrGenerateSecret(name, currentContent) {
  const regex = new RegExp(`^${name}=(.+)$`, 'm');
  const match = currentContent.match(regex);
  
  if (match && match[1].trim()) {
    console.log(`✅ ${name} já está configurado`);
    return null; // Já existe, não precisa gerar
  }
  
  const secret = crypto.randomBytes(32).toString('base64');
  console.log(`🔑 Gerando novo ${name}...`);
  return `${name}=${secret}`;
}

const jwtSecret = getOrGenerateSecret('JWT_SECRET', envContent);
const nextAuthSecret = getOrGenerateSecret('NEXTAUTH_SECRET', envContent);

// Adicionar segredos ao arquivo se necessário
let updated = false;
let newContent = envContent;

if (jwtSecret) {
  // Remover linha antiga se existir (sem valor)
  newContent = newContent.replace(/^JWT_SECRET=.*$/m, '');
  newContent += (newContent.endsWith('\n') ? '' : '\n') + jwtSecret + '\n';
  updated = true;
}

if (nextAuthSecret) {
  // Remover linha antiga se existir (sem valor)
  newContent = newContent.replace(/^NEXTAUTH_SECRET=.*$/m, '');
  newContent += (newContent.endsWith('\n') ? '' : '\n') + nextAuthSecret + '\n';
  updated = true;
}

if (updated) {
  fs.writeFileSync(envPath, newContent, 'utf8');
  console.log('\n✅ Arquivo .env.local atualizado com sucesso!');
  console.log('⚠️  IMPORTANTE: Reinicie o servidor de desenvolvimento para aplicar as mudanças.');
} else {
  console.log('\n✅ Todas as variáveis necessárias já estão configuradas!');
}

