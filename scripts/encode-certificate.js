const fs = require('fs');
const path = require('path');

console.log('🔐 Codificador de Certificado para GitHub Secrets\n');

const certPath = path.join(__dirname, '..', 'cert', 'certificado-lucas.pfx');
const outputPath = path.join(__dirname, '..', 'cert-base64.txt');

// Verificar se o certificado existe
if (!fs.existsSync(certPath)) {
  console.error('❌ Erro: Certificado não encontrado!');
  console.error(`   Procurado em: ${certPath}`);
  console.error('\n💡 Certifique-se de que o arquivo certificado-lucas.pfx está na pasta cert/');
  process.exit(1);
}

try {
  // Ler o arquivo do certificado
  const certBuffer = fs.readFileSync(certPath);
  
  // Converter para base64
  const base64Cert = certBuffer.toString('base64');
  
  // Salvar em arquivo
  fs.writeFileSync(outputPath, base64Cert);
  
  console.log('✅ Certificado codificado com sucesso!\n');
  console.log('📄 Arquivo gerado: cert-base64.txt');
  console.log(`📊 Tamanho: ${(base64Cert.length / 1024).toFixed(2)} KB\n`);
  console.log('📋 Próximos passos:\n');
  console.log('1. Acesse: https://github.com/koalitos/FinancePass/settings/secrets/actions');
  console.log('2. Clique em "New repository secret"');
  console.log('3. Adicione um secret:');
  console.log('   - Nome: WINDOWS_CERT_BASE64');
  console.log('   - Valor: Cole o conteúdo do arquivo cert-base64.txt');
  console.log('4. Adicione outro secret:');
  console.log('   - Nome: WINDOWS_CERT_PASSWORD');
  console.log('   - Valor: A senha do seu certificado');
  console.log('\n⚠️  IMPORTANTE: Delete o arquivo cert-base64.txt após adicionar no GitHub!');
  console.log('   Comando: del cert-base64.txt\n');
  
} catch (error) {
  console.error('❌ Erro ao processar certificado:', error.message);
  process.exit(1);
}
