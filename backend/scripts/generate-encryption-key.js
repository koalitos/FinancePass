const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🔐 Gerador de Chave de Criptografia\n');

// Gerar chave aleatória segura
const key = crypto.randomBytes(32).toString('hex');

console.log('✅ Chave gerada com sucesso!\n');
console.log('📋 Adicione esta linha no seu arquivo .env:\n');
console.log(`ENCRYPTION_KEY=${key}\n`);

// Tentar adicionar automaticamente ao .env
const envPath = path.join(__dirname, '..', '.env');

try {
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    // Verificar se já existe ENCRYPTION_KEY
    if (envContent.includes('ENCRYPTION_KEY=')) {
      console.log('⚠️  ATENÇÃO: Já existe uma ENCRYPTION_KEY no .env!');
      console.log('⚠️  Substituir a chave fará com que senhas antigas não possam ser descriptografadas!\n');
      console.log('💡 Se você quer substituir mesmo assim, edite manualmente o .env\n');
      process.exit(0);
    }
  } else {
    // Criar .env baseado no .env.example
    const examplePath = path.join(__dirname, '..', '.env.example');
    if (fs.existsSync(examplePath)) {
      envContent = fs.readFileSync(examplePath, 'utf8');
    }
  }
  
  // Adicionar ou substituir a chave
  if (envContent.includes('ENCRYPTION_KEY=')) {
    envContent = envContent.replace(
      /ENCRYPTION_KEY=.*/,
      `ENCRYPTION_KEY=${key}`
    );
  } else {
    envContent += `\n# Chave de Criptografia (gerada automaticamente)\nENCRYPTION_KEY=${key}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Chave adicionada ao arquivo .env automaticamente!\n');
  console.log('🔒 IMPORTANTE: Não compartilhe esta chave e não a commite no Git!\n');
  
} catch (error) {
  console.error('❌ Erro ao salvar no .env:', error.message);
  console.log('\n💡 Adicione manualmente a chave acima no arquivo .env\n');
}

console.log('📝 Próximos passos:');
console.log('1. Reinicie o backend');
console.log('2. As novas senhas serão criptografadas com esta chave');
console.log('3. Senhas antigas precisarão ser recadastradas\n');
