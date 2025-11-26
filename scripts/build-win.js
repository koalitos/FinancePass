const { build } = require('electron-builder');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building Windows installer...\n');

const certPath = path.join(__dirname, '..', 'cert', 'certificado-lucas.pfx');
const hasCertificate = fs.existsSync(certPath);

if (hasCertificate) {
  console.log('✅ Certificate found - installer will be signed');
} else {
  console.log('⚠️  No certificate found - installer will NOT be signed');
  console.log('💡 To enable signing, run: npm run encode-cert\n');
}

const config = {
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64']
      }
    ],
    icon: 'assets/icon.ico',
    artifactName: '${productName}-Setup-${version}.${ext}',
    publisherName: 'Koalitos'
  }
};

// Adicionar configuração de certificado apenas se existir
if (hasCertificate && process.env.WINDOWS_CERT_PASSWORD) {
  config.win.certificateFile = './cert/certificado-lucas.pfx';
  config.win.certificatePassword = process.env.WINDOWS_CERT_PASSWORD;
  config.win.signingHashAlgorithms = ['sha256'];
}

build({
  config,
  win: ['nsis'],
  publish: 'never'
})
  .then(() => {
    console.log('\n✅ Build completed successfully!');
  })
  .catch((error) => {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
  });
