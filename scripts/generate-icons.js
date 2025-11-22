const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Gerando ícones para o FinancePass...\n');

// Verificar se o sharp está instalado
try {
  require.resolve('sharp');
} catch (e) {
  console.log('📦 Instalando dependências necessárias...');
  execSync('npm install sharp png-to-ico --save-dev', { stdio: 'inherit' });
}

const sharp = require('sharp');
const pngToIco = require('png-to-ico');

const assetsDir = path.join(__dirname, '..', 'assets');
const svgPath = path.join(assetsDir, 'icon.svg');

// Criar diretório assets se não existir
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

async function generateIcons() {
  try {
    // Gerar PNG principal (512x512)
    console.log('✅ Gerando icon.png (512x512)...');
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(assetsDir, 'icon.png'));

    // Gerar PNG para ICO (256x256)
    console.log('✅ Gerando PNG temporário para ICO...');
    const png256Path = path.join(assetsDir, 'icon-256.png');
    await sharp(svgPath)
      .resize(256, 256)
      .png()
      .toFile(png256Path);

    // Gerar ICO para Windows
    console.log('✅ Gerando icon.ico para Windows...');
    const buf = await pngToIco(png256Path);
    fs.writeFileSync(path.join(assetsDir, 'icon.ico'), buf);

    // Limpar arquivo temporário
    fs.unlinkSync(png256Path);

    // Gerar ICNS para macOS (requer iconutil no macOS)
    if (process.platform === 'darwin') {
      console.log('✅ Gerando icon.icns para macOS...');
      const iconsetDir = path.join(assetsDir, 'icon.iconset');
      
      if (!fs.existsSync(iconsetDir)) {
        fs.mkdirSync(iconsetDir);
      }

      // Gerar todos os tamanhos necessários para ICNS
      const sizes = [16, 32, 64, 128, 256, 512];
      for (const size of sizes) {
        await sharp(svgPath)
          .resize(size, size)
          .png()
          .toFile(path.join(iconsetDir, `icon_${size}x${size}.png`));
        
        // Versão @2x
        await sharp(svgPath)
          .resize(size * 2, size * 2)
          .png()
          .toFile(path.join(iconsetDir, `icon_${size}x${size}@2x.png`));
      }

      // Converter para ICNS
      execSync(`iconutil -c icns "${iconsetDir}" -o "${path.join(assetsDir, 'icon.icns')}"`, { stdio: 'inherit' });
      
      // Limpar iconset
      fs.rmSync(iconsetDir, { recursive: true, force: true });
    } else {
      console.log('⚠️  ICNS só pode ser gerado no macOS. Pulando...');
    }

    console.log('\n✨ Ícones gerados com sucesso!');
    console.log('📁 Arquivos criados em:', assetsDir);
    console.log('   - icon.svg (original)');
    console.log('   - icon.png (512x512)');
    console.log('   - icon.ico (Windows)');
    if (process.platform === 'darwin') {
      console.log('   - icon.icns (macOS)');
    }

  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error);
    process.exit(1);
  }
}

generateIcons();
