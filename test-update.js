// Script para testar auto-update
const { app } = require('electron');
const { autoUpdater } = require('electron-updater');

console.log('='.repeat(50));
console.log('🧪 Teste de Auto-Update');
console.log('='.repeat(50));
console.log('📦 Versão atual:', app.getVersion());
console.log('📦 App empacotado:', app.isPackaged);
console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
console.log('📁 App path:', app.getAppPath());
console.log('='.repeat(50));

// Configurar auto-updater
autoUpdater.autoDownload = false;
autoUpdater.logger = console;

autoUpdater.on('checking-for-update', () => {
  console.log('🔍 Verificando atualizações...');
});

autoUpdater.on('update-available', (info) => {
  console.log('🎉 Atualização disponível!');
  console.log('   Versão:', info.version);
  console.log('   Data:', info.releaseDate);
  console.log('   Arquivos:', info.files);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('✅ App está atualizado');
  console.log('   Versão atual:', info.version);
});

autoUpdater.on('error', (err) => {
  console.error('❌ Erro:', err);
});

// Verificar
console.log('\n🚀 Iniciando verificação...\n');
autoUpdater.checkForUpdates()
  .then(result => {
    console.log('\n✅ Resultado:', result);
  })
  .catch(err => {
    console.error('\n❌ Erro:', err);
  });
