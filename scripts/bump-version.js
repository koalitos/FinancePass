const fs = require('fs');
const path = require('path');

// Ler argumentos da linha de comando
const args = process.argv.slice(2);
const versionType = args[0] || 'patch'; // patch, minor, major

// Ler package.json
const packagePath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Ler version.js do frontend
const versionPath = path.join(__dirname, '../frontend/src/config/version.js');

// Pegar versão atual
const currentVersion = packageJson.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Calcular nova versão
let newVersion;
switch (versionType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

console.log(`📦 Atualizando versão: ${currentVersion} → ${newVersion}`);

// Atualizar package.json
packageJson.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
console.log('✅ package.json atualizado');

// Atualizar version.js
const versionContent = `// Versão do aplicativo - sincronizada com package.json
export const APP_VERSION = '${newVersion}';
export const APP_NAME = 'FinancePass';
`;
fs.writeFileSync(versionPath, versionContent);
console.log('✅ frontend/src/config/version.js atualizado');

console.log(`\n🎉 Versão atualizada para ${newVersion}!`);
console.log('\nPróximos passos:');
console.log('  git add .');
console.log(`  git commit -m "v${newVersion}"`);
console.log(`  git tag v${newVersion}`);
console.log('  git push origin main --tags');
