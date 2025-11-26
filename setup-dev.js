const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setup de Desenvolvimento - FinancePass\n');

// Verificar se já foi configurado
const envPath = path.join(__dirname, 'backend', '.env');
const alreadySetup = fs.existsSync(envPath);

if (alreadySetup) {
  console.log('✅ Ambiente já configurado!');
  console.log('📁 Arquivo .env encontrado em: backend/.env\n');
  
  // Ler e mostrar info da chave
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const keyMatch = envContent.match(/ENCRYPTION_KEY=(.+)/);
    if (keyMatch) {
      const key = keyMatch[1];
      console.log('🔐 Chave de criptografia: ' + key.substring(0, 16) + '...');
      console.log('✅ Suas senhas continuarão funcionando!\n');
    }
  } catch (error) {
    console.log('⚠️  Não foi possível ler a chave\n');
  }
  
  console.log('💡 Comandos úteis:');
  console.log('   npm run dev          - Iniciar desenvolvimento');
  console.log('   npm run generate-key - Gerar nova chave (perde senhas!)');
  console.log('   npm run fix-encryption - Resetar senhas\n');
  
  process.exit(0);
}

console.log('📦 Primeira configuração detectada!\n');
console.log('Executando setup...\n');

// 1. Instalar dependências
console.log('1️⃣  Instalando dependências...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências root instaladas\n');
} catch (error) {
  console.error('❌ Erro ao instalar dependências root');
}

try {
  execSync('npm install --prefix backend', { stdio: 'inherit' });
  console.log('✅ Dependências backend instaladas\n');
} catch (error) {
  console.error('❌ Erro ao instalar dependências backend');
}

try {
  execSync('npm install --prefix frontend', { stdio: 'inherit' });
  console.log('✅ Dependências frontend instaladas\n');
} catch (error) {
  console.error('❌ Erro ao instalar dependências frontend');
}

// 2. Gerar chave de criptografia
console.log('2️⃣  Gerando chave de criptografia...');
try {
  execSync('npm run generate-key --prefix backend', { stdio: 'inherit' });
  console.log('✅ Chave gerada com sucesso!\n');
} catch (error) {
  console.error('❌ Erro ao gerar chave');
}

// 3. Verificar se tudo está OK
console.log('3️⃣  Verificando configuração...');
const checks = [
  { file: 'backend/.env', name: 'Arquivo .env' },
  { file: 'backend/node_modules', name: 'Dependências backend' },
  { file: 'frontend/node_modules', name: 'Dependências frontend' },
];

let allOk = true;
checks.forEach(check => {
  const exists = fs.existsSync(path.join(__dirname, check.file));
  if (exists) {
    console.log(`   ✅ ${check.name}`);
  } else {
    console.log(`   ❌ ${check.name} - FALTANDO!`);
    allOk = false;
  }
});

console.log('');

if (allOk) {
  console.log('🎉 Setup concluído com sucesso!\n');
  console.log('📝 Próximos passos:');
  console.log('   1. npm run dev          - Iniciar desenvolvimento');
  console.log('   2. Abrir http://localhost:5173');
  console.log('   3. Criar sua conta e começar a usar!\n');
  console.log('💾 IMPORTANTE: Faça backup do backend/.env');
  console.log('   Comando: cp backend/.env backup/.env\n');
} else {
  console.log('⚠️  Setup incompleto. Verifique os erros acima.\n');
  process.exit(1);
}
