#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando setup do Financial Manager...\n');

// Verificar Node.js
console.log('✓ Verificando Node.js...');
try {
  const nodeVersion = execSync('node --version').toString().trim();
  console.log(`  Node.js ${nodeVersion} detectado\n`);
} catch (error) {
  console.error('❌ Node.js não encontrado. Por favor, instale o Node.js 16+');
  process.exit(1);
}

// Criar arquivo .env se não existir
console.log('✓ Configurando variáveis de ambiente...');
const envPath = path.join(__dirname, 'backend', '.env');
const envExamplePath = path.join(__dirname, 'backend', '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('  Arquivo .env criado a partir do .env.example\n');
} else if (fs.existsSync(envPath)) {
  console.log('  Arquivo .env já existe\n');
} else {
  console.log('  ⚠️  Arquivo .env.example não encontrado\n');
}

// Instalar dependências
console.log('📦 Instalando dependências...\n');

try {
  console.log('  Instalando dependências raiz...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n  Instalando dependências do backend...');
  execSync('cd backend && npm install', { stdio: 'inherit', shell: true });
  
  console.log('\n  Instalando dependências do frontend...');
  execSync('cd frontend && npm install', { stdio: 'inherit', shell: true });
  
  console.log('\n✅ Setup concluído com sucesso!\n');
  console.log('📝 Próximos passos:');
  console.log('   1. Configure o arquivo backend/.env se necessário');
  console.log('   2. Execute "npm run dev" para iniciar em modo desenvolvimento');
  console.log('   3. Execute "npm run build:win" para criar executável Windows\n');
  
} catch (error) {
  console.error('\n❌ Erro durante a instalação:', error.message);
  process.exit(1);
}
