#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ler versão do package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);

const version = packageJson.version;
const tag = `v${version}`;

console.log('🚀 Criando release para versão:', version);
console.log('📦 Tag:', tag);
console.log('');

// Verificar se há mudanças não commitadas
try {
  const status = execSync('git status --porcelain').toString();
  if (status) {
    console.error('❌ Erro: Há mudanças não commitadas!');
    console.error('');
    console.error('Execute:');
    console.error('  git add .');
    console.error('  git commit -m "chore: prepare release v' + version + '"');
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Erro ao verificar status do git:', err.message);
  process.exit(1);
}

// Verificar se a tag já existe
try {
  const tags = execSync('git tag').toString();
  if (tags.includes(tag)) {
    console.error('❌ Erro: Tag', tag, 'já existe!');
    console.error('');
    console.error('Para criar uma nova release, atualize a versão no package.json');
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Erro ao verificar tags:', err.message);
  process.exit(1);
}

// Criar tag
try {
  console.log('📝 Criando tag...');
  execSync(`git tag -a ${tag} -m "Release ${version}"`, { stdio: 'inherit' });
  console.log('✅ Tag criada!');
  console.log('');
} catch (err) {
  console.error('❌ Erro ao criar tag:', err.message);
  process.exit(1);
}

// Push da tag
try {
  console.log('🚀 Fazendo push da tag...');
  execSync(`git push origin ${tag}`, { stdio: 'inherit' });
  console.log('✅ Tag enviada!');
  console.log('');
} catch (err) {
  console.error('❌ Erro ao fazer push da tag:', err.message);
  console.error('');
  console.error('Para remover a tag local:');
  console.error('  git tag -d', tag);
  process.exit(1);
}

console.log('✅ Release criada com sucesso!');
console.log('');
console.log('🔗 Acompanhe o build em:');
console.log('   https://github.com/koalitos/FinancePass/actions');
console.log('');
console.log('📦 Quando terminar, a release estará em:');
console.log('   https://github.com/koalitos/FinancePass/releases');
