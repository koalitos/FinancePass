const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ALGORITHM = 'aes-256-cbc';

// Função para obter o caminho de dados do usuário (persiste entre atualizações)
function getUserDataPath() {
  // Em produção (Electron), usar userData path
  if (process.env.ELECTRON_USER_DATA) {
    return process.env.ELECTRON_USER_DATA;
  }
  
  // Em desenvolvimento, usar pasta local
  return path.join(__dirname, '..', '..');
}

// Função para garantir que existe uma chave persistente
function getOrCreateEncryptionKey() {
  // Tentar pegar do .env primeiro (desenvolvimento)
  if (process.env.ENCRYPTION_KEY) {
    return process.env.ENCRYPTION_KEY;
  }
  
  // Caminho para a chave (persiste entre atualizações)
  const userDataPath = getUserDataPath();
  const keyFilePath = path.join(userDataPath, '.encryption-key');
  
  // Verificar se já existe uma chave salva
  if (fs.existsSync(keyFilePath)) {
    try {
      const savedKey = fs.readFileSync(keyFilePath, 'utf8').trim();
      if (savedKey && savedKey.length === 64) {
        console.log('[Encryption] ✅ Chave existente carregada');
        console.log('[Encryption] 📁 Local:', keyFilePath);
        return savedKey;
      }
    } catch (error) {
      console.error('[Encryption] ⚠️  Erro ao ler chave salva:', error.message);
    }
  }
  
  // Gerar nova chave
  const newKey = crypto.randomBytes(32).toString('hex');
  
  try {
    // Salvar chave em arquivo persistente
    fs.writeFileSync(keyFilePath, newKey, { mode: 0o600 }); // Permissão apenas para o usuário
    
    console.log('');
    console.log('='.repeat(60));
    console.log('[Encryption] 🔐 NOVA CHAVE DE CRIPTOGRAFIA GERADA!');
    console.log('[Encryption] ✅ Salva em:', keyFilePath);
    console.log('[Encryption] 📝 Chave:', newKey.substring(0, 16) + '...');
    console.log('[Encryption] 🔒 Esta chave persiste entre atualizações!');
    console.log('='.repeat(60));
    console.log('');
    
    // Também salvar no .env para desenvolvimento
    const envPath = path.join(__dirname, '..', '..', '.env');
    if (!fs.existsSync(envPath) || !fs.readFileSync(envPath, 'utf8').includes('ENCRYPTION_KEY=')) {
      try {
        let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
        envContent += `\n# Chave de Criptografia (gerada automaticamente)\nENCRYPTION_KEY=${newKey}\n`;
        fs.writeFileSync(envPath, envContent);
        console.log('[Encryption] 📝 Também salva em .env para desenvolvimento');
      } catch (err) {
        // Ignorar erro no .env (não é crítico)
      }
    }
    
    return newKey;
  } catch (error) {
    console.error('[Encryption] ❌ ERRO ao salvar chave:', error.message);
    console.error('[Encryption] ⚠️  Usando chave temporária (senhas não persistirão!)');
    return newKey;
  }
}

const KEY_STRING = getOrCreateEncryptionKey();

// Ensure the key is exactly 32 bytes for AES-256
const MASTER_KEY = crypto.createHash('sha256').update(KEY_STRING).digest();

// Log da chave (apenas primeiros caracteres para debug)
console.log('[Encryption] Key initialized:', KEY_STRING.substring(0, 10) + '...');
console.log('[Encryption] Master key length:', MASTER_KEY.length, 'bytes');

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, MASTER_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid encrypted text');
    }
    
    const parts = text.split(':');
    if (parts.length < 2) {
      throw new Error('Invalid encrypted format');
    }
    
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, MASTER_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error('[Encryption] Decryption error:', error.message);
    
    // Erro específico de chave incorreta
    if (error.message.includes('BAD_DECRYPT') || error.message.includes('wrong final block length')) {
      throw new Error('ENCRYPTION_KEY_CHANGED: A chave de criptografia mudou. Execute: npm run fix-encryption');
    }
    
    throw new Error('Failed to decrypt password: ' + error.message);
  }
}

module.exports = { encrypt, decrypt };
