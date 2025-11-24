// Script para remover quarentena do macOS automaticamente
const { exec } = require('child_process');
const { app, dialog } = require('electron');
const path = require('path');

/**
 * Verifica se o app está em quarentena no macOS
 */
function checkQuarantine() {
  return new Promise((resolve) => {
    if (process.platform !== 'darwin') {
      resolve(false);
      return;
    }

    const appPath = app.getPath('exe');
    const appBundle = appPath.split('.app/')[0] + '.app';
    
    exec(`xattr -l "${appBundle}"`, (error, stdout) => {
      if (error) {
        resolve(false);
        return;
      }
      
      // Verifica se tem atributo de quarentena
      const hasQuarantine = stdout.includes('com.apple.quarantine');
      resolve(hasQuarantine);
    });
  });
}

/**
 * Remove a quarentena do app
 */
function removeQuarantine() {
  return new Promise((resolve, reject) => {
    const appPath = app.getPath('exe');
    const appBundle = appPath.split('.app/')[0] + '.app';
    
    // Criar AppleScript para pedir permissão de administrador
    const script = `
      do shell script "xattr -cr '${appBundle}'" with administrator privileges
    `;
    
    exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(true);
    });
  });
}

/**
 * Mostra diálogo perguntando se quer remover quarentena
 */
async function promptRemoveQuarantine(mainWindow) {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: 'Permissão Necessária',
    message: 'O FinancePass precisa de permissão para executar',
    detail: 'O macOS está bloqueando o app porque ele não está assinado com certificado Apple Developer.\n\nDeseja permitir que o FinancePass execute normalmente?\n\nIsso removerá os atributos de quarentena do app.',
    buttons: ['Permitir', 'Agora Não', 'Mais Informações'],
    defaultId: 0,
    cancelId: 1
  });

  if (result.response === 2) {
    // Mostrar mais informações
    await dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Por que isso é necessário?',
      message: 'Sobre a segurança do macOS',
      detail: 'O FinancePass é um app open source gratuito e não está assinado com certificado Apple Developer (custo de $99/ano).\n\nO macOS marca apps baixados da internet com atributos de quarentena por segurança.\n\nAo clicar em "Permitir", o app removerá esses atributos para que você possa usá-lo normalmente.\n\nSeus dados continuam seguros e privados no seu computador.',
      buttons: ['Entendi']
    });
    
    // Perguntar novamente
    return promptRemoveQuarantine(mainWindow);
  }

  return result.response === 0; // true se clicou em "Permitir"
}

/**
 * Verifica e corrige quarentena automaticamente
 */
async function checkAndFixQuarantine(mainWindow) {
  try {
    const isQuarantined = await checkQuarantine();
    
    if (!isQuarantined) {
      console.log('✅ App não está em quarentena');
      return true;
    }

    console.log('⚠️  App está em quarentena - solicitando permissão...');
    
    const shouldFix = await promptRemoveQuarantine(mainWindow);
    
    if (!shouldFix) {
      console.log('ℹ️  Usuário optou por não remover quarentena');
      return false;
    }

    console.log('🔧 Removendo quarentena...');
    await removeQuarantine();
    
    console.log('✅ Quarentena removida com sucesso!');
    
    // Mostrar mensagem de sucesso
    await dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Sucesso!',
      message: 'Permissão concedida',
      detail: 'O FinancePass agora pode executar normalmente.\n\nVocê não precisará fazer isso novamente.',
      buttons: ['OK']
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao remover quarentena:', error);
    
    // Mostrar instruções manuais
    await dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Erro ao Remover Quarentena',
      message: 'Não foi possível remover automaticamente',
      detail: `Por favor, execute este comando no Terminal:\n\nxattr -cr /Applications/FinancePass.app\n\nErro: ${error.message}`,
      buttons: ['Copiar Comando', 'OK']
    }).then((result) => {
      if (result.response === 0) {
        // Copiar comando para clipboard
        const { clipboard } = require('electron');
        clipboard.writeText('xattr -cr /Applications/FinancePass.app');
      }
    });
    
    return false;
  }
}

module.exports = {
  checkQuarantine,
  removeQuarantine,
  checkAndFixQuarantine
};
