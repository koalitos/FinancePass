/**
 * 🍎 Assistente de Atualização para macOS
 * 
 * Gerencia atualizações no macOS de forma mais confiável:
 * - Baixa o DMG diretamente do GitHub
 * - Monta o DMG automaticamente
 * - Mostra instruções visuais para o usuário
 * - Funciona com o app aberto
 */

const { app, dialog, shell, BrowserWindow } = require('electron');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class MacUpdateAssistant {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.updateWindow = null;
    this.downloadPath = null;
    this.latestVersion = null;
  }

  /**
   * Verifica se há atualizações disponíveis
   */
  async checkForUpdates() {
    try {
      console.log('🔍 [MacUpdate] Verificando atualizações...');
      
      const currentVersion = app.getVersion();
      const latestRelease = await this.getLatestRelease();
      
      if (!latestRelease) {
        console.log('❌ [MacUpdate] Não foi possível obter informações da release');
        return null;
      }

      const latestVersion = latestRelease.tag_name.replace('v', '');
      
      console.log('📦 [MacUpdate] Versão atual:', currentVersion);
      console.log('📦 [MacUpdate] Última versão:', latestVersion);

      if (this.compareVersions(latestVersion, currentVersion) > 0) {
        console.log('✅ [MacUpdate] Atualização disponível!');
        this.latestVersion = latestRelease;
        return latestRelease;
      }

      console.log('✅ [MacUpdate] App está atualizado');
      return null;
    } catch (error) {
      console.error('❌ [MacUpdate] Erro ao verificar atualizações:', error);
      return null;
    }
  }

  /**
   * Obtém informações da última release do GitHub
   */
  async getLatestRelease() {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: '/repos/koalitos/FinancePass/releases/latest',
        method: 'GET',
        headers: {
          'User-Agent': 'FinancePass-Updater'
        }
      };

      https.get(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const release = JSON.parse(data);
            resolve(release);
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Mostra diálogo perguntando se o usuário quer atualizar
   */
  async showUpdateDialog(releaseInfo) {
    const currentVersion = app.getVersion();
    const newVersion = releaseInfo.tag_name.replace('v', '');

    const response = await dialog.showMessageBox(this.mainWindow, {
      type: 'info',
      title: 'Atualização Disponível',
      message: `Nova versão disponível: ${newVersion}`,
      detail: `Versão atual: ${currentVersion}\n\n` +
              `Deseja baixar e instalar a atualização?\n\n` +
              `O processo é simples:\n` +
              `1. Download automático do instalador\n` +
              `2. Instalador será aberto automaticamente\n` +
              `3. Arraste o app para a pasta Aplicativos`,
      buttons: ['Baixar Agora', 'Ver Detalhes', 'Mais Tarde'],
      defaultId: 0,
      cancelId: 2
    });

    if (response.response === 0) {
      // Baixar agora
      await this.downloadAndInstall(releaseInfo);
      return true;
    } else if (response.response === 1) {
      // Ver detalhes
      shell.openExternal(releaseInfo.html_url);
      return false;
    }

    return false;
  }

  /**
   * Baixa e instala a atualização
   */
  async downloadAndInstall(releaseInfo) {
    try {
      // Detectar arquitetura
      const arch = process.arch === 'arm64' ? 'arm64' : 'x64';
      
      // Encontrar o DMG correto
      const dmgAsset = releaseInfo.assets.find(asset => 
        asset.name.endsWith('.dmg') && asset.name.includes(arch)
      );

      if (!dmgAsset) {
        throw new Error(`DMG não encontrado para arquitetura ${arch}`);
      }

      console.log('📥 [MacUpdate] Baixando:', dmgAsset.name);

      // Criar janela de progresso
      this.createProgressWindow();

      // Baixar DMG
      const downloadPath = path.join(app.getPath('downloads'), dmgAsset.name);
      await this.downloadFile(dmgAsset.browser_download_url, downloadPath);

      this.downloadPath = downloadPath;

      // Fechar janela de progresso
      if (this.updateWindow) {
        this.updateWindow.close();
        this.updateWindow = null;
      }

      // Mostrar diálogo de sucesso
      const installResponse = await dialog.showMessageBox(this.mainWindow, {
        type: 'info',
        title: 'Download Concluído',
        message: 'Atualização baixada com sucesso!',
        detail: `O instalador foi salvo em:\n${downloadPath}\n\n` +
                `Deseja abrir o instalador agora?`,
        buttons: ['Abrir Instalador', 'Abrir Pasta', 'Mais Tarde'],
        defaultId: 0
      });

      if (installResponse.response === 0) {
        // Abrir instalador
        await this.openInstaller(downloadPath);
      } else if (installResponse.response === 1) {
        // Abrir pasta
        shell.showItemInFolder(downloadPath);
      }

    } catch (error) {
      console.error('❌ [MacUpdate] Erro ao baixar/instalar:', error);
      
      if (this.updateWindow) {
        this.updateWindow.close();
        this.updateWindow = null;
      }

      dialog.showErrorBox(
        'Erro na Atualização',
        `Não foi possível baixar a atualização.\n\n${error.message}`
      );
    }
  }

  /**
   * Cria janela de progresso do download
   */
  createProgressWindow() {
    this.updateWindow = new BrowserWindow({
      width: 500,
      height: 300,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      resizable: false,
      parent: this.mainWindow,
      modal: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    this.updateWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
            width: 100%;
            max-width: 450px;
          }
          .icon { font-size: 48px; margin-bottom: 15px; }
          .title { font-size: 20px; font-weight: 600; margin-bottom: 10px; color: #333; }
          .message { font-size: 14px; color: #666; margin-bottom: 20px; }
          .progress-bar {
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 10px;
          }
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            width: 0%;
            transition: width 0.3s ease;
            animation: pulse 1.5s ease-in-out infinite;
          }
          .status { font-size: 12px; color: #999; }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">📥</div>
          <div class="title">Baixando Atualização</div>
          <div class="message">Aguarde enquanto baixamos a nova versão...</div>
          <div class="progress-bar">
            <div class="progress-fill" id="progress"></div>
          </div>
          <div class="status" id="status">Iniciando download...</div>
        </div>
      </body>
      </html>
    `)}`);

    this.updateWindow.center();
  }

  /**
   * Atualiza o progresso do download
   */
  updateProgress(percent, downloaded, total) {
    if (this.updateWindow && !this.updateWindow.isDestroyed()) {
      this.updateWindow.webContents.executeJavaScript(`
        document.getElementById('progress').style.width = '${percent}%';
        document.getElementById('status').textContent = 
          'Baixado: ${downloaded}MB de ${total}MB (${percent}%)';
      `);
    }
  }

  /**
   * Baixa um arquivo com progresso
   */
  async downloadFile(url, destination) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destination);
      let downloadedBytes = 0;
      let totalBytes = 0;

      https.get(url, (response) => {
        // Seguir redirects
        if (response.statusCode === 302 || response.statusCode === 301) {
          https.get(response.headers.location, handleResponse);
          return;
        }

        handleResponse(response);
      }).on('error', reject);

      const handleResponse = (response) => {
        totalBytes = parseInt(response.headers['content-length'], 10);

        response.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          file.write(chunk);

          const percent = Math.round((downloadedBytes / totalBytes) * 100);
          const downloadedMB = (downloadedBytes / 1024 / 1024).toFixed(1);
          const totalMB = (totalBytes / 1024 / 1024).toFixed(1);

          this.updateProgress(percent, downloadedMB, totalMB);
        });

        response.on('end', () => {
          file.end();
          resolve();
        });

        response.on('error', reject);
      };
    });
  }

  /**
   * Abre o instalador DMG
   */
  async openInstaller(dmgPath) {
    try {
      console.log('📦 [MacUpdate] Abrindo instalador:', dmgPath);
      
      // Abrir o DMG
      await shell.openPath(dmgPath);

      // Mostrar instruções
      setTimeout(() => {
        dialog.showMessageBox(this.mainWindow, {
          type: 'info',
          title: 'Instalação',
          message: 'Siga as instruções do instalador',
          detail: 'Para instalar a atualização:\n\n' +
                  '1. Arraste o FinancePass para a pasta Aplicativos\n' +
                  '2. Substitua a versão antiga quando solicitado\n' +
                  '3. Feche este app e abra o novo\n\n' +
                  'Seus dados serão preservados!',
          buttons: ['OK']
        });
      }, 1000);

    } catch (error) {
      console.error('❌ [MacUpdate] Erro ao abrir instalador:', error);
      shell.showItemInFolder(dmgPath);
    }
  }

  /**
   * Compara duas versões (semver)
   */
  compareVersions(v1, v2) {
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
}

module.exports = MacUpdateAssistant;
