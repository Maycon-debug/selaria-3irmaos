// Script para configurar variáveis de ambiente necessárias
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

console.log('🔧 Configurando variáveis de ambiente...\n');

// Ler arquivo existente se houver
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Arquivo .env.local encontrado\n');
} else {
  console.log('📄 Criando novo arquivo .env.local\n');
}

// Escapar caracteres especiais para regex
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Gerar segredos se não existirem
function getOrGenerateSecret(name, currentContent) {
  const escapedName = escapeRegex(name);
  const regex = new RegExp(`^${escapedName}=(.+)$`, 'm');
  const match = currentContent.match(regex);
  
  if (match && match[1].trim()) {
    console.log(`✅ ${name} já está configurado`);
    return null; // Já existe, não precisa gerar
  }
  
  const secret = crypto.randomBytes(32).toString('base64');
  console.log(`🔑 Gerando novo ${name}...`);
  return `${name}=${secret}`;
}

// Verificar e adicionar variáveis obrigatórias se não existirem
function ensureVariable(name, defaultValue, description) {
  const escapedName = escapeRegex(name);
  const regex = new RegExp(`^${escapedName}=(.+)$`, 'm');
  const match = envContent.match(regex);
  
  if (match && match[1].trim()) {
    console.log(`✅ ${name} já está configurado`);
    return null;
  }
  
  console.log(`➕ Adicionando ${name} (${description})`);
  return `${name}=${defaultValue}`;
}

const jwtSecret = getOrGenerateSecret('JWT_SECRET', envContent);
const nextAuthSecret = getOrGenerateSecret('NEXTAUTH_SECRET', envContent);

// Variáveis obrigatórias com valores padrão para desenvolvimento
const databaseUrl = ensureVariable('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/vaquejada_db', 'URL do banco de dados');
const nextAuthUrl = ensureVariable('NEXTAUTH_URL', 'http://localhost:3000', 'URL da aplicação');
const nextPublicAppUrl = ensureVariable('NEXT_PUBLIC_APP_URL', 'http://localhost:3000', 'URL pública da aplicação');
const nodeEnv = ensureVariable('NODE_ENV', 'development', 'Ambiente de execução');

// Variáveis opcionais (só adiciona se arquivo estiver vazio)
const optionalVars = [];
if (!envContent.trim()) {
  optionalVars.push(
    '# ============================================',
    '# OBRIGATÓRIAS',
    '# ============================================',
    '',
    '# ============================================',
    '# OPCIONAIS - Preencher se necessário',
    '# ============================================',
    '',
    '# OAuth Google (deixar vazio se não usar)',
    'GOOGLE_CLIENT_ID=""',
    'GOOGLE_CLIENT_SECRET=""',
    '',
    '# Cloudinary (deixar vazio se não usar)',
    'CLOUDINARY_CLOUD_NAME=""',
    'CLOUDINARY_API_KEY=""',
    'CLOUDINARY_API_SECRET=""',
    '',
    '# Filestack (alternativa ao Cloudinary)',
    'FILESTACK_API_KEY=""',
    '',
    '# Email Resend (deixar vazio se não usar)',
    'EMAIL_SERVICE="none"',
    'RESEND_API_KEY=""',
    'FROM_EMAIL=""'
  );
}

// Adicionar segredos e variáveis ao arquivo se necessário
let updated = false;
let newContent = envContent;

// Adicionar variáveis obrigatórias
const varsToAdd = [
  jwtSecret,
  nextAuthSecret,
  databaseUrl,
  nextAuthUrl,
  nextPublicAppUrl,
  nodeEnv
].filter(Boolean);

if (varsToAdd.length > 0) {
  // Processar cada variável
  varsToAdd.forEach(variable => {
    const varName = variable.split('=')[0];
    const escapedName = escapeRegex(varName);
    
    // Remover linha antiga se existir (incluindo comentários na mesma linha)
    // Remove linha completa que começa com o nome da variável
    newContent = newContent.replace(new RegExp(`^${escapedName}=.*$`, 'gm'), '');
  });
  
  // Limpar linhas vazias duplicadas e no início/fim
  newContent = newContent.replace(/\n{3,}/g, '\n\n');
  newContent = newContent.replace(/^\n+/, '');
  newContent = newContent.replace(/\n+$/, '');
  
  // Adicionar novas variáveis no final
  if (newContent && !newContent.endsWith('\n')) {
    newContent += '\n';
  }
  
  varsToAdd.forEach(variable => {
    newContent += variable + '\n';
  });
  
  updated = true;
}

// Adicionar variáveis opcionais se arquivo estava vazio
if (optionalVars.length > 0) {
  // Garantir que há uma linha em branco antes das opcionais
  if (newContent && !newContent.endsWith('\n')) {
    newContent += '\n';
  }
  newContent += '\n' + optionalVars.join('\n') + '\n';
  updated = true;
}

// Limpar linhas vazias extras no final
if (updated) {
  newContent = newContent.replace(/\n{3,}/g, '\n\n');
  newContent = newContent.replace(/\n+$/, '\n');
}

if (updated) {
  fs.writeFileSync(envPath, newContent, 'utf8');
  console.log('\n✅ Arquivo .env.local atualizado com sucesso!');
  console.log('\n📋 Próximos passos:');
  console.log('   1. Verifique o arquivo .env.local');
  console.log('   2. Configure DATABASE_URL se usar PostgreSQL local diferente');
  console.log('   3. Inicie o banco: docker-compose up -d');
  console.log('   4. Execute migrations: npm run db:migrate');
  console.log('   5. Reinicie o servidor: npm run dev');
} else {
  console.log('\n✅ Todas as variáveis obrigatórias já estão configuradas!');
  console.log('\n💡 Dica: Execute "npm run dev" para testar a aplicação.');
}

console.log('\n📖 Veja GUIA_VARIAVEIS_AMBIENTE.md para mais detalhes.\n');

