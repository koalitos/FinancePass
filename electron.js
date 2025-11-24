const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Desabilitar aceleração de hardware para evitar erros de GPU
app.disableHardwareAcceleration();

// Detectar modo dev de forma mais robusta
let isDev;
if (process.env.NODE_ENV === 'production') {
  isDev = false;
} else if (process.env.NODE_ENV === 'development') {
  isDev = true;
} else {
  isDev = !app.isPackaged && fs.existsSync(path.join(__dirname, 'package.json'));
}

const backendPort = 5174;

let mainWindow;
let loadingWindow;
let backendProcess;
let updateDownloaded = false; // Flag para rastrear se a atualização foi baixada

// Configurar auto-updater
autoUpdater.autoDownload = false; // Controlado manualmente para mostrar progresso
autoUpdater.autoInstallOnAppQuit = false; // Desabilitado - vamos controlar manualmente
autoUpdater.logger = console; // Log para debug

// Configuração específica para macOS
if (process.platform === 'darwin') {
  autoUpdater.allowDowngrade = false;
  autoUpdater.allowPrerelease = false;
  // No macOS, forçar instalação manual para garantir que funcione
  autoUpdater.autoInstallOnAppQuit = false;
  console.log('🍎 Configuração macOS ativada para auto-update');
}

// Prevenir múltiplas instâncias apenas no app empacotado
if (app.isPackaged) {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    console.log('⚠️  Outra instância já está rodando. Encerrando...');
    app.quit();
    process.exit(0);
  }
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Logs iniciais
console.log('='.repeat(50));
console.log('🚀 FinancePass - Iniciando...');
console.log('='.repeat(50));
console.log('📍 Diretório:', __dirname);
console.log('📁 User Data:', app.getPath('userData'));
console.log('📁 App Data:', app.getPath('appData'));
console.log('🔧 process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('🔧 app.isPackaged:', app.isPackaged);
console.log('🔧 isDev:', isDev);
console.log('🔧 Modo:', isDev ? 'DESENVOLVIMENTO' : 'PRODUÇÃO');
console.log('🌐 Porta Backend:', backendPort);
console.log('='.repeat(50));

function createLoadingWindow() {
  console.log('⏳ Criando tela de loading...');
  try {
    loadingWindow = new BrowserWindow({
      width: 500,
      height: 400,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    loadingWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          overflow: hidden;
        }
        .loading-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .logo {
          font-size: 64px;
          margin-bottom: 20px;
          animation: bounce 1s infinite;
        }
        .title {
          color: white;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .subtitle {
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          margin-bottom: 30px;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .status {
          color: rgba(255,255,255,0.9);
          font-size: 12px;
          margin-top: 20px;
          min-height: 20px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      </style>
    </head>
    <body>
      <div class="loading-container">
        <div class="logo">💰</div>
        <div class="title">FinancePass</div>
        <div class="subtitle">Iniciando aplicação...</div>
        <div class="spinner"></div>
        <div class="status" id="status">Carregando serviços</div>
      </div>
      <script>
        const messages = [
          'Carregando serviços...',
          'Iniciando backend...',
          'Preparando interface...',
          'Quase pronto...'
        ];
        let index = 0;
        setInterval(() => {
          document.getElementById('status').textContent = messages[index];
          index = (index + 1) % messages.length;
        }, 1500);
      </script>
    </body>
    </html>
  `)}`);

    loadingWindow.center();
    loadingWindow.show();
    console.log('✅ Tela de loading criada');
  } catch (err) {
    console.error('❌ Erro ao criar tela de loading:', err);
  }
}

async function createWindow() {
  console.log('🪟 Criando janela principal...');

  const iconPath = process.platform === 'win32' 
    ? path.join(__dirname, 'assets/icon.ico')
    : process.platform === 'darwin'
    ? path.join(__dirname, 'assets/icon.icns')
    : path.join(__dirname, 'assets/icon.png');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev
    },
    icon: iconPath,
    show: false,
    autoHideMenuBar: true
  });

  // Remover menu padrão em produção
  if (!isDev) {
    Menu.setApplicationMenu(null);
  }

  // Em dev, sempre usar porta do frontend (5173)
  // Em prod, usar o backend que serve o frontend buildado
  const startUrl = isDev
    ? 'http://localhost:5173'
    : `http://localhost:${backendPort}`;

  console.log('🌐 Loading URL:', startUrl);
  console.log('🔧 isDev:', isDev);

  mainWindow.loadURL(startUrl).catch(err => {
    console.error('❌ Failed to load URL:', err);
  });

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    console.log('✅ Main window ready to show');
    if (loadingWindow && !loadingWindow.isDestroyed()) {
      loadingWindow.close();
      loadingWindow = null;
    }
    mainWindow.show();
  });

  // Timeout de segurança - se não carregar em 10 segundos, mostrar mesmo assim
  setTimeout(() => {
    if (mainWindow && !mainWindow.isVisible()) {
      console.log('⏰ Timeout reached, showing window anyway');
      if (loadingWindow && !loadingWindow.isDestroyed()) {
        loadingWindow.close();
        loadingWindow = null;
      }
      mainWindow.show();
    }
  }, 10000);

  // Abrir DevTools em desenvolvimento
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Abrir DevTools com F12
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      mainWindow.webContents.toggleDevTools();
    }
  });

  // Listener para erros de carregamento
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Failed to load:', errorCode, errorDescription);
    console.error('❌ URL:', validatedURL);
    
    if (loadingWindow && !loadingWindow.isDestroyed()) {
      loadingWindow.close();
      loadingWindow = null;
    }
    mainWindow.show();
    
    dialog.showErrorBox('Erro ao Carregar',
      `Não foi possível carregar o aplicativo.\n\n` +
      `Erro: ${errorDescription}\n` +
      `URL: ${validatedURL}\n\n` +
      (isDev ? 'Certifique-se de que está usando: npm run dev' : 'Tente reinstalar o aplicativo.')
    );
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (loadingWindow && !loadingWindow.isDestroyed()) {
      loadingWindow.close();
      loadingWindow = null;
    }
  });

  // Prevenir navegação externa - abrir no navegador padrão
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      event.preventDefault();
      require('electron').shell.openExternal(url);
    }
  });

  // Abrir links externos (target="_blank", window.open) no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Se for link externo, abrir no navegador
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      require('electron').shell.openExternal(url);
      return { action: 'deny' }; // Não abrir nova janela do Electron
    }
    return { action: 'allow' }; // Permitir se for localhost
  });

  // Verificar atualizações após 3 segundos
  if (!isDev) {
    console.log('🔍 Agendando verificação de atualizações...');
    setTimeout(() => {
      console.log('🔍 Verificando atualizações agora...');
      autoUpdater.checkForUpdates()
        .then(result => {
          console.log('✅ Verificação de atualizações concluída:', result);
        })
        .catch(err => {
          console.error('❌ Erro ao verificar atualizações:', err);
        });
    }, 3000);
  } else {
    console.log('⚠️ Modo desenvolvimento - auto-update desabilitado');
  }
}

function startBackend() {
  let backendPath;
  let backendCwd;

  if (app.isPackaged) {
    const resourcesPath = process.resourcesPath || path.dirname(app.getAppPath());
    backendPath = path.join(resourcesPath, 'backend', 'server.js');
    backendCwd = path.join(resourcesPath, 'backend');
  } else {
    backendPath = path.join(__dirname, 'backend', 'server.js');
    backendCwd = path.join(__dirname, 'backend');
  }

  console.log('');
  console.log('🔧 Iniciando Backend...');
  console.log('📁 Caminho:', backendPath);
  console.log('📁 CWD:', backendCwd);

  if (!fs.existsSync(backendPath)) {
    console.error('❌ ERRO: Arquivo do backend não encontrado!');
    console.error('❌ Procurado em:', backendPath);
    return;
  }

  console.log('✅ Arquivo do backend encontrado');

  const nodePath = process.execPath;
  console.log('✅ Usando Node.js do Electron:', nodePath);

  // Obter o caminho de dados do usuário
  const userDataPath = app.getPath('userData');
  console.log('📁 User Data Path:', userDataPath);

  backendProcess = spawn(nodePath, [backendPath], {
    cwd: backendCwd,
    env: {
      ...process.env,
      PORT: backendPort,
      NODE_ENV: isDev ? 'development' : 'production',
      ELECTRON_RUN_AS_NODE: '1',
      ELECTRON_USER_DATA: userDataPath
    }
  });

  backendProcess.stdout.on('data', (data) => {
    const message = data.toString().trim();
    if (message) {
      console.log(`[Backend] ${message}`);
    }
  });

  backendProcess.stderr.on('data', (data) => {
    const message = data.toString().trim();
    if (message) {
      console.error(`[Backend Error] ${message}`);
    }
  });

  console.log('✅ Processo do backend iniciado (PID:', backendProcess.pid, ')');

  backendProcess.on('close', (code, signal) => {
    console.log(`❌ Backend process exited with code ${code}, signal: ${signal}`);
    if (code !== 0 && code !== null) {
      console.error('Backend encerrou com erro. Verifique os logs acima.');
      dialog.showErrorBox('Erro no Backend',
        `O servidor backend encerrou inesperadamente.\nCódigo: ${code}\n\nVerifique o terminal para mais detalhes.`
      );
    }
  });

  backendProcess.on('error', (err) => {
    console.error('❌ Erro ao iniciar backend:', err);
    dialog.showErrorBox('Erro ao Iniciar Backend',
      `Não foi possível iniciar o servidor backend.\n\nErro: ${err.message}`
    );
  });
}

function stopBackend() {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
}

// Verificar se uma porta está respondendo
function checkPort(port) {
  return new Promise((resolve) => {
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 500
    };

    const req = http.request(options, (res) => {
      resolve(true);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Verificar se o backend está pronto
function checkBackendReady(retries = 0, maxRetries = 40) {
  if (retries === 0) {
    console.log('');
    console.log('🔍 Verificando se backend está pronto...');
  }

  return new Promise((resolve) => {
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: backendPort,
      path: '/api/health',
      method: 'GET',
      timeout: 2000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Backend está pronto!');
        console.log('');
        resolve(true);
      } else {
        if (retries < maxRetries) {
          if (retries % 4 === 0) {
            console.log(`⏳ Aguardando backend... (${retries + 1}/${maxRetries})`);
          }
          setTimeout(() => {
            checkBackendReady(retries + 1, maxRetries).then(resolve);
          }, 500);
        } else {
          console.log('⚠️ Backend não respondeu após várias tentativas');
          resolve(false);
        }
      }
    });

    req.on('error', (err) => {
      if (retries < maxRetries) {
        if (retries % 4 === 0) {
          console.log(`⏳ Aguardando backend... (${retries + 1}/${maxRetries})`);
        }
        setTimeout(() => {
          checkBackendReady(retries + 1, maxRetries).then(resolve);
        }, 500);
      } else {
        console.log('⚠️ Backend não respondeu após várias tentativas');
        console.log('⚠️ Último erro:', err.message);
        resolve(false);
      }
    });

    req.on('timeout', () => {
      req.destroy();
      if (retries < maxRetries) {
        setTimeout(() => {
          checkBackendReady(retries + 1, maxRetries).then(resolve);
        }, 500);
      } else {
        resolve(false);
      }
    });

    req.end();
  });
}

// Eventos do Electron
app.whenReady().then(async () => {
  // Mostrar tela de loading
  createLoadingWindow();

  // Aguardar um pouco antes de iniciar o backend
  console.log('⏳ Preparando ambiente...');
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Verificar se backend já está rodando
  console.log('🔍 Verificando se backend já está rodando...');
  let backendReady = await checkBackendReady(0, 2);

  // Se não estiver rodando, iniciar
  if (!backendReady) {
    console.log('🔧 Iniciando backend...');
    startBackend();
    
    console.log('⏳ Aguardando backend iniciar...');
    backendReady = await checkBackendReady(0, 20);
  } else {
    console.log('✅ Backend já está rodando!');
  }

  if (!backendReady) {
    console.error('⚠️ Backend não respondeu, mas continuando...');
    console.error('⚠️ O app pode não funcionar corretamente');
  }

  // Criar janela principal
  await createWindow();
  
  // Verificar e corrigir quarentena no macOS (apenas na primeira execução)
  if (process.platform === 'darwin' && !isDev && mainWindow) {
    const { checkAndFixQuarantine } = require('./scripts/fix-quarantine');
    
    // Verificar se já foi executado antes
    const hasRunBefore = app.getPath('userData') + '/.quarantine-fixed';
    const fs = require('fs');
    
    if (!fs.existsSync(hasRunBefore)) {
      console.log('🍎 Primeira execução no macOS - verificando quarentena...');
      
      setTimeout(async () => {
        const fixed = await checkAndFixQuarantine(mainWindow);
        
        if (fixed) {
          // Marcar como executado
          fs.writeFileSync(hasRunBefore, new Date().toISOString());
        }
      }, 2000); // Aguardar 2 segundos após abrir o app
    }
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopBackend();
    app.quit();
  }
});

app.on('before-quit', () => {
  stopBackend();
});

app.on('will-quit', () => {
  stopBackend();
});

// Função para comparar versões (semver)
function compareVersions(v1, v2) {
  const parts1 = v1.replace(/^v/, '').split('.').map(Number);
  const parts2 = v2.replace(/^v/, '').split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  
  return 0;
}

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Auto-updater eventos
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Verificando atualizações...');
});

autoUpdater.on('update-available', (info) => {
  const currentVersion = app.getVersion();
  const newVersion = info.version;
  
  console.log('🎉 Atualização disponível!');
  console.log('   Versão atual:', currentVersion);
  console.log('   Nova versão:', newVersion);
  
  // Validar se a nova versão é realmente maior
  if (compareVersions(newVersion, currentVersion) > 0) {
    console.log('✅ Nova versão é maior - mostrando notificação');
    sendStatusToWindow('Atualização disponível!');
    
    // Enviar para o frontend mostrar notificação no canto
    if (mainWindow) {
      mainWindow.webContents.send('update-available', info);
    }
  } else {
    console.log('⚠️ Nova versão não é maior - ignorando');
    console.log('   Comparação:', newVersion, 'vs', currentVersion);
  }
});

autoUpdater.on('update-not-available', (info) => {
  const currentVersion = app.getVersion();
  console.log('✅ App está atualizado');
  console.log('   Versão atual:', currentVersion);
  if (info && info.version) {
    console.log('   Última versão disponível:', info.version);
  }
  sendStatusToWindow('Aplicação está atualizada.');
});

autoUpdater.on('error', (err) => {
  console.error('❌ Erro ao verificar atualizações:', err);
  sendStatusToWindow('Erro ao verificar atualizações: ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  const percent = Math.round(progressObj.percent);
  const downloaded = (progressObj.transferred / 1024 / 1024).toFixed(1);
  const total = (progressObj.total / 1024 / 1024).toFixed(1);
  
  console.log(`📥 Baixando atualização: ${percent}% (${downloaded}MB / ${total}MB)`);
  
  let message = `Baixando: ${percent}% (${downloaded}MB de ${total}MB)`;
  sendStatusToWindow(message);
  
  if (mainWindow) {
    mainWindow.setProgressBar(progressObj.percent / 100);
    mainWindow.webContents.send('download-progress', {
      percent: percent,
      downloaded: downloaded,
      total: total
    });
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('✅ Atualização baixada:', info.version);
  console.log('   Arquivos baixados e prontos para instalação');
  updateDownloaded = true; // Marcar que a atualização foi baixada
  sendStatusToWindow('Atualização baixada. Será instalada ao reiniciar.');
  
  if (mainWindow) {
    mainWindow.setProgressBar(-1); // Remove barra de progresso
    mainWindow.webContents.send('update-downloaded', info);
  }
});

// IPC handlers
ipcMain.on('check-for-updates', () => {
  if (!isDev) {
    autoUpdater.checkForUpdates();
  }
});

ipcMain.on('download-update', () => {
  if (!isDev) {
    autoUpdater.downloadUpdate();
  }
});

ipcMain.on('install-update', () => {
  console.log('📥 Recebido comando install-update');
  console.log('   isDev:', isDev);
  console.log('   Platform:', process.platform);
  console.log('   updateDownloaded:', updateDownloaded);
  
  if (!isDev) {
    if (!updateDownloaded) {
      console.error('❌ Nenhuma atualização foi baixada ainda!');
      if (mainWindow) {
        mainWindow.webContents.send('update-status', 'Erro: Nenhuma atualização disponível');
      }
      return;
    }
    
    console.log('🔄 Instalando atualização e reiniciando...');
    
    try {
      // Fechar a janela principal primeiro
      if (mainWindow) {
        mainWindow.removeAllListeners('close');
      }
      
      // No macOS, precisamos garantir que o app feche completamente antes de instalar
      if (process.platform === 'darwin') {
        console.log('🍎 macOS detectado - usando instalação específica');
        
        // Parar o backend antes de atualizar
        stopBackend();
        
        // Aguardar um pouco para garantir que tudo foi fechado
        setTimeout(() => {
          console.log('⚡ Executando quitAndInstall no macOS...');
          
          // No macOS com ZIP:
          // - isSilent: true = não mostra diálogos
          // - isForceRunAfter: true = força reiniciar após instalação
          autoUpdater.quitAndInstall(true, true);
        }, 500);
      } else {
        // Windows e Linux
        setImmediate(() => {
          console.log('⚡ Executando quitAndInstall...');
          autoUpdater.quitAndInstall(false, true);
          
          // Fallback: se quitAndInstall não funcionar, força o quit
          setTimeout(() => {
            console.log('⚠️  quitAndInstall não fechou o app, forçando quit...');
            app.quit();
          }, 1000);
        });
      }
    } catch (error) {
      console.error('❌ Erro ao instalar atualização:', error);
      if (mainWindow) {
        mainWindow.webContents.send('update-status', 'Erro ao instalar: ' + error.message);
      }
    }
  } else {
    console.log('⚠️  Modo dev - install-update ignorado');
  }
});

// Handler para reiniciar o backend
ipcMain.on('restart-backend', (event) => {
  console.log('🔄 Recebido comando para reiniciar backend');
  
  try {
    // Parar o backend atual
    if (backendProcess) {
      console.log('⏹️  Parando backend atual...');
      stopBackend();
    }
    
    // Aguardar um pouco antes de reiniciar
    setTimeout(() => {
      console.log('▶️  Reiniciando backend...');
      startBackend();
      
      // Aguardar backend iniciar e notificar o frontend
      setTimeout(() => {
        if (mainWindow) {
          mainWindow.webContents.send('backend-restarted', { success: true });
        }
      }, 3000);
    }, 1000);
    
  } catch (error) {
    console.error('❌ Erro ao reiniciar backend:', error);
    if (mainWindow) {
      mainWindow.webContents.send('backend-restarted', { 
        success: false, 
        error: error.message 
      });
    }
  }
});

function sendStatusToWindow(text) {
  console.log(text);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', text);
  }
}
