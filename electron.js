const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

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

// Configurar auto-updater
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

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

  // Verificar se frontend dev está rodando
  const frontendDevRunning = await checkPort(5173);
  const startUrl = frontendDevRunning
    ? 'http://localhost:5173'
    : `http://localhost:${backendPort}`;

  console.log('🌐 Loading URL:', startUrl);

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

  // Prevenir navegação externa
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('http://localhost') && !url.startsWith('file://')) {
      event.preventDefault();
      require('electron').shell.openExternal(url);
    }
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

  backendProcess = spawn(nodePath, [backendPath], {
    cwd: backendCwd,
    env: {
      ...process.env,
      PORT: backendPort,
      NODE_ENV: isDev ? 'development' : 'production',
      ELECTRON_RUN_AS_NODE: '1'
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
  console.log('🎉 Atualização disponível:', info.version);
  sendStatusToWindow('Atualização disponível!');
  
  // Enviar para o frontend mostrar notificação no canto
  if (mainWindow) {
    mainWindow.webContents.send('update-available', info);
  }
});

autoUpdater.on('update-not-available', () => {
  console.log('✅ App está atualizado');
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
  if (!isDev) {
    autoUpdater.quitAndInstall(false, true);
  }
});

function sendStatusToWindow(text) {
  console.log(text);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', text);
  }
}
