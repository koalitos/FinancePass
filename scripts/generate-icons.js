#!/usr/bin/env node
/**
 * Gerador de Ícones para FinancePass
 * Cria ícones modernos usando Canvas (Node.js)
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Cores do gradiente
const COLOR1 = { r: 59, g: 130, b: 246 };   // #3b82f6 (azul)
const COLOR2 = { r: 139, g: 92, b: 246 };   // #8b5cf6 (roxo)

/**
 * Cria gradiente vertical
 */
function createGradient(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, `rgb(${COLOR1.r}, ${COLOR1.g}, ${COLOR1.b})`);
  gradient.addColorStop(1, `rgb(${COLOR2.r}, ${COLOR2.g}, ${COLOR2.b})`);
  return gradient;
}

/**
 * Cria ícone V2 com cadeado e cifrão
 */
function createRoundedIcon(size = 512) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fundo transparente
  ctx.clearRect(0, 0, size, size);
  
  // Desenhar retângulo arredondado com gradiente
  const radius = size / 5;
  
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  
  // Preencher com gradiente
  ctx.fillStyle = createGradient(ctx, size, size);
  ctx.fill();
  
  // Adicionar brilho superior
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(0, 0, size, size / 2);
  ctx.restore();
  
  // Dimensões do cadeado
  const lockWidth = size * 0.3;
  const lockHeight = size * 0.27;
  const lockX = (size - lockWidth) / 2;
  const lockY = size * 0.47;
  const lockRadius = lockWidth / 8;
  
  // Corpo do cadeado (retângulo arredondado branco)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = size / 60;
  ctx.shadowOffsetX = size / 170;
  ctx.shadowOffsetY = size / 170;
  
  ctx.beginPath();
  ctx.moveTo(lockX + lockRadius, lockY);
  ctx.lineTo(lockX + lockWidth - lockRadius, lockY);
  ctx.quadraticCurveTo(lockX + lockWidth, lockY, lockX + lockWidth, lockY + lockRadius);
  ctx.lineTo(lockX + lockWidth, lockY + lockHeight - lockRadius);
  ctx.quadraticCurveTo(lockX + lockWidth, lockY + lockHeight, lockX + lockWidth - lockRadius, lockY + lockHeight);
  ctx.lineTo(lockX + lockRadius, lockY + lockHeight);
  ctx.quadraticCurveTo(lockX, lockY + lockHeight, lockX, lockY + lockHeight - lockRadius);
  ctx.lineTo(lockX, lockY + lockRadius);
  ctx.quadraticCurveTo(lockX, lockY, lockX + lockRadius, lockY);
  ctx.closePath();
  ctx.fill();
  
  // Arco superior do cadeado
  const arcThickness = size * 0.06;
  const arcTop = size * 0.35;
  const arcHeight = lockY - arcTop;
  const arcWidth = lockWidth * 0.7;
  const arcX = lockX + (lockWidth - arcWidth) / 2;
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = arcThickness;
  ctx.lineCap = 'round';
  
  // Desenhar arco
  ctx.beginPath();
  ctx.arc(
    lockX + lockWidth / 2,
    arcTop + arcHeight,
    arcWidth / 2,
    Math.PI,
    0,
    false
  );
  ctx.stroke();
  
  // Linhas verticais do arco
  ctx.beginPath();
  ctx.moveTo(arcX + arcThickness / 2, arcTop + arcHeight);
  ctx.lineTo(arcX + arcThickness / 2, lockY);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(arcX + arcWidth - arcThickness / 2, arcTop + arcHeight);
  ctx.lineTo(arcX + arcWidth - arcThickness / 2, lockY);
  ctx.stroke();
  
  // Resetar sombra
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // Cifrão no centro do cadeado
  ctx.fillStyle = 'rgb(59, 130, 246)'; // Azul do gradiente
  ctx.font = `bold ${size * 0.16}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const dollarY = lockY + lockHeight / 2;
  ctx.fillText('$', size / 2, dollarY);
  
  return canvas;
}

/**
 * Cria ícone circular
 */
function createCircularIcon(size = 512) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fundo transparente
  ctx.clearRect(0, 0, size, size);
  
  // Desenhar círculo com gradiente
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - size / 8;
  
  // Gradiente radial
  const gradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, radius
  );
  gradient.addColorStop(0, `rgb(${COLOR1.r}, ${COLOR1.g}, ${COLOR1.b})`);
  gradient.addColorStop(1, `rgb(${COLOR2.r}, ${COLOR2.g}, ${COLOR2.b})`);
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Borda branca semi-transparente
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = size / 60;
  ctx.stroke();
  
  // Desenhar símbolo $
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size / 2}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Sombra do texto
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = size / 40;
  ctx.shadowOffsetX = size / 80;
  ctx.shadowOffsetY = size / 80;
  
  ctx.fillText('$', centerX, centerY);
  
  return canvas;
}

/**
 * Salva canvas como PNG
 */
function saveCanvas(canvas, filePath) {
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);
  console.log(`✅ Criado: ${filePath}`);
}

/**
 * Redimensiona canvas
 */
function resizeCanvas(sourceCanvas, newSize) {
  const canvas = createCanvas(newSize, newSize);
  const ctx = canvas.getContext('2d');
  
  ctx.drawImage(sourceCanvas, 0, 0, newSize, newSize);
  
  return canvas;
}

/**
 * Função principal
 */
async function main() {
  console.log('🎨 Gerando ícones V2 do FinancePass (Cadeado + Cifrão)...\n');
  
  // Diretórios
  const projectDir = path.join(__dirname, '..');
  const assetsDir = path.join(projectDir, 'assets');
  const publicDir = path.join(projectDir, 'frontend', 'public');
  
  // Criar diretórios se não existirem
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Criar ícone V2
  console.log('📐 Criando ícone V2 (Cadeado + Cifrão)...');
  const icon = createRoundedIcon(1024);
  
  // Salvar ícone principal
  console.log('\n💾 Salvando ícone principal...');
  saveCanvas(icon, path.join(assetsDir, 'icon.png'));
  
  // Tamanhos para gerar
  const sizes = [16, 32, 48, 64, 128, 192, 256, 512, 1024];
  
  console.log('\n💾 Salvando tamanhos variados em assets/...');
  
  // Salvar em assets/
  for (const size of sizes) {
    const resized = resizeCanvas(icon, size);
    saveCanvas(resized, path.join(assetsDir, `icon-${size}.png`));
  }
  
  // Salvar em public/
  console.log('\n💾 Salvando para frontend/public/...');
  saveCanvas(resizeCanvas(icon, 16), path.join(publicDir, 'favicon-16x16.png'));
  saveCanvas(resizeCanvas(icon, 32), path.join(publicDir, 'favicon-32x32.png'));
  saveCanvas(resizeCanvas(icon, 192), path.join(publicDir, 'logo192.png'));
  saveCanvas(resizeCanvas(icon, 512), path.join(publicDir, 'logo512.png'));
  
  console.log('\n✅ Todos os ícones V2 foram gerados com sucesso!');
  console.log(`\n📁 Ícones salvos em:`);
  console.log(`   - ${assetsDir}/icon.png (1024x1024)`);
  console.log(`   - ${assetsDir}/icon-16.png até icon-1024.png`);
  console.log(`   - ${publicDir}/logo192.png e logo512.png`);
  console.log(`   - ${publicDir}/favicon-16x16.png e favicon-32x32.png`);
  console.log('\n🎉 Pronto! FinancePass agora tem o ícone V2 (Cadeado + Cifrão)!');
  console.log('\n💡 Próximo passo: Criar o .ico para Windows');
  console.log('   Use: https://convertio.co/png-ico/');
  console.log('   Upload: icon-16.png, icon-32.png, icon-48.png, icon-64.png');
}

// Executar
main().catch(console.error);
