const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Enviar comandos
  send: (channel, data) => {
    const validChannels = ['check-for-updates', 'download-update', 'install-update'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // Receber eventos
  on: (channel, callback) => {
    const validChannels = ['update-available', 'update-downloaded', 'download-progress', 'update-status', 'update-downloading'];
    if (validChannels.includes(channel)) {
      const subscription = (event, ...args) => callback(...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    }
  },
  
  // Remover todos os listeners
  removeAllListeners: (channel) => {
    const validChannels = ['update-available', 'update-downloaded', 'download-progress', 'update-status', 'update-downloading'];
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
    }
  }
});
