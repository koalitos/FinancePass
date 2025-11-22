const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const KEY_STRING = process.env.ENCRYPTION_KEY || process.env.MASTER_KEY || crypto.randomBytes(32).toString('hex');
// Ensure the key is exactly 32 bytes for AES-256
const MASTER_KEY = crypto.createHash('sha256').update(KEY_STRING).digest();

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, MASTER_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, MASTER_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
