#!/usr/bin/env node
/**
 * Gerador de Ícones V2 para FinancePass usando Sharp
 * Converte o SVG para PNG em múltiplos tamanhos
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  console.log('🎨 Gerando ícones V2 do FinancePass (Cadeado + Cifrão)...\n');
  
  // Diretórios
  const projectDir = path.join(__dirname, '..');
  const assetsDir = path.join(projectDir, 'assets');
  const publicDir = path.join(projectDir, 'frontend', 'public');
  
  // Arquivo SVG de origem
  const svgPath = path.join(assetsDir, 'icon.svg');
  
  // Verificar se SVG existe
  if (!fs.existsSync(svgPath)) {
    console.error('❌ Erro: icon.svg não encontrado em assets/');
    console.error('   Esperado em:', svgPath);
    process.exit(1);
  }
  
  console.log('✅ SVG encontrado:', svgPath);
  console.log('');
  
  // Criar diretórios se não existirem
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Tamanhos para gerar
  const sizes = [16, 32, 48, 64, 128, 192, 256, 512, 1024];
  
  console.log('📐 Gerando ícones em múltiplos tamanhos...\n');
  
  // Gerar ícones em assets/
  console.log('💾 Salvando em assets/...');
  for (const size of sizes) {
    const outputPath = path.join(assetsDir, `icon-${size}.png`);
    
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`   ✅ icon-${size}.png`);
    } catch (error) {
      console.error(`   ❌ Erro ao gerar icon-${size}.png:`, error.message);
    }
  }
  
  // Gerar ícone principal (1024x1024)
  const mainIconPath = path.join(assetsDir, 'icon.png');
  await sharp(svgPath)
    .resize(1024, 1024)
    .png()
    .toFile(mainIconPath);
  console.log(`   ✅ icon.png (1024x1024)`);
  
  // Gerar ícones para frontend/public/
  console.log('\n💾 Salvando em frontend/public/...');
  
  // Favicon 16x16
  await sharp(svgPath)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  console.log('   ✅ favicon-16x16.png');
  
  // Favicon 32x32
  await sharp(svgPath)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('   ✅ favicon-32x32.png');
  
  // Logo 192 (PWA)
  await sharp(svgPath)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'logo192.png'));
  console.log('   ✅ logo192.png');
  
  // Logo 512 (PWA)
  await sharp(svgPath)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo512.png'));
  console.log('   ✅ logo512.png');
  
  console.log('\n✅ Todos os ícones V2 foram gerados com sucesso!');
  console.log(`\n📁 Ícones salvos em:`);
  console.log(`   - ${assetsDir}/`);
  console.log(`     • icon.png (1024x1024)`);
  console.log(`     • icon-16.png até icon-1024.png`);
  console.log(`   - ${publicDir}/`);
  console.log(`     • logo192.png e logo512.png`);
  console.log(`     • favicon-16x16.png e favicon-32x32.png`);
  
  console.log('\n🎉 Pronto! FinancePass agora tem o ícone V2 (Cadeado + Cifrão)!');
  console.log('\n💡 Próximo passo: Criar o .ico para Windows');
  console.log('   Opção 1: Use png-to-ico (já instalado)');
  console.log('   Opção 2: Use https://convertio.co/png-ico/');
  console.log('   Upload: icon-16.png, icon-32.png, icon-48.png, icon-64.png, icon-256.png');
  
  // Tentar criar ICO automaticamente
  console.log('\n🔧 Tentando criar icon.ico automaticamente...');
  try {
    const pngToIco = require('png-to-ico');
    
    const iconFiles = [
      path.join(assetsDir, 'icon-16.png'),
      path.join(assetsDir, 'icon-32.png'),
      path.join(assetsDir, 'icon-48.png'),
      path.join(assetsDir, 'icon-64.png'),
      path.join(assetsDir, 'icon-256.png')
    ];
    
    const icoBuffer = await pngToIco(iconFiles);
    fs.writeFileSync(path.join(assetsDir, 'icon.ico'), icoBuffer);
    console.log('   ✅ icon.ico criado com sucesso!');
    
    // Copiar para public também
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
    console.log('   ✅ favicon.ico criado com sucesso!');
    
  } catch (error) {
    console.log('   ⚠️  Não foi possível criar ICO automaticamente');
    console.log('   💡 Use uma ferramenta online para criar o ICO');
  }
  
  console.log('\n🎊 Processo concluído!');
}

// Executar
generateIcons().catch(error => {
  console.error('\n❌ Erro ao gerar ícones:', error);
  process.exit(1);
});
