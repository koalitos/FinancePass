const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let backendProcess;

// Configurar auto-updater
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    show: false
  });

  // Remover menu padrão
  Menu.setApplicationMenu(null);

  // Carregar aplicação
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'frontend/build/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Mostrar quando estiver pronto
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Verificar atualizações após 3 segundos
  if (!isDev) {
    setTimeout(() => {
      autoUpdater.checkForUpdates();
    }, 3000);
  }
}

// Iniciar backend
function startBackend() {
  if (isDev) return; // Em dev, backend roda separado

  const { spawn } = require('child_process');
  const backendPath = path.join(__dirname, 'backend/server.js');
  
  backendProcess = spawn('node', [backendPath], {
    cwd: path.join(__dirname, 'backend')
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });
}

// Eventos do Electron
app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Auto-updater eventos
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Verificando atualizações...');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Atualização disponível!');
  mainWindow.webContents.send('update-available', info);
});

autoUpdater.on('update-not-available', () => {
  sendStatusToWindow('Aplicação está atualizada.');
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Erro ao verificar atualizações: ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let message = `Baixando: ${progressObj.percent.toFixed(2)}%`;
  message += ` (${(progressObj.transferred / 1024 / 1024).toFixed(2)}MB de ${(progressObj.total / 1024 / 1024).toFixed(2)}MB)`;
  sendStatusToWindow(message);
  mainWindow.webContents.send('download-progress', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Atualização baixada. Será instalada ao reiniciar.');
  mainWindow.webContents.send('update-downloaded', info);
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
