import React, { useState, useEffect } from 'react';
import { Download, X, RefreshCw } from 'lucide-react';

const AutoUpdater = () => {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [readyToInstall, setReadyToInstall] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Verificar se está rodando no Electron
    if (!window.electron || typeof window.electron.on !== 'function') {
      console.log('AutoUpdater: Não está rodando no Electron');
      return;
    }

    console.log('AutoUpdater: Configurando listeners...');

    // Listener para atualização disponível - inicia download automaticamente
    const unsubscribeAvailable = window.electron.on('update-available', (info) => {
      console.log('Atualização disponível:', info);
      setUpdateInfo(info);
      setDownloading(true);
      setShowNotification(true);
      // Auto-download
      window.electron.send('download-update');
    });

    // Listener para progresso do download
    const unsubscribeProgress = window.electron.on('download-progress', (progress) => {
      console.log('Progresso do download:', progress);
      setDownloadProgress(progress.percent || 0);
    });

    // Listener para download completo
    const unsubscribeDownloaded = window.electron.on('update-downloaded', () => {
      console.log('Atualização baixada e pronta para instalar');
      setDownloading(false);
      setReadyToInstall(true);
    });

    // Verificar atualizações ao iniciar
    checkForUpdates();

    // Verificar atualizações a cada 2 horas
    const interval = setInterval(() => {
      checkForUpdates();
    }, 2 * 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
      if (typeof unsubscribeAvailable === 'function') unsubscribeAvailable();
      if (typeof unsubscribeProgress === 'function') unsubscribeProgress();
      if (typeof unsubscribeDownloaded === 'function') unsubscribeDownloaded();
    };
  }, []);

  const checkForUpdates = () => {
    if (window.electron && typeof window.electron.send === 'function') {
      window.electron.send('check-for-updates');
    }
  };

  const installUpdate = () => {
    if (window.electron && typeof window.electron.send === 'function') {
      window.electron.send('install-update');
    }
  };

  if (!showNotification) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="bg-gradient-to-r from-primary to-blue-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                {readyToInstall ? (
                  <RefreshCw className="text-white" size={24} />
                ) : (
                  <Download className="text-white" size={24} />
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  {readyToInstall ? 'Atualização Pronta!' : 'Baixando Atualização'}
                </h3>
                <p className="text-blue-100 text-sm">
                  Versão {updateInfo?.version || 'mais recente'}
                </p>
              </div>
            </div>
            {!readyToInstall && (
              <button
                onClick={() => setShowNotification(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="p-4 bg-dark-card">
          {readyToInstall ? (
            <div className="space-y-3">
              <p className="text-sm text-dark-text">
                A atualização foi baixada com sucesso! Clique para reiniciar e instalar.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNotification(false)}
                  className="flex-1 bg-dark-bg text-dark-text py-2.5 px-4 rounded-lg hover:bg-dark-border transition-all font-medium border border-dark-border"
                >
                  Depois
                </button>
                <button
                  onClick={installUpdate}
                  className="flex-1 bg-gradient-to-r from-success to-emerald-600 text-white py-2.5 px-4 rounded-lg hover:from-success/90 hover:to-emerald-600/90 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Reiniciar Agora
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-dark-text font-medium">Baixando...</span>
                <span className="text-primary font-bold">{Math.round(downloadProgress)}%</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2.5 overflow-hidden border border-dark-border">
                <div
                  className="bg-gradient-to-r from-primary to-blue-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <p className="text-xs text-dark-muted">
                Você pode continuar usando o app. A instalação será feita ao fechar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoUpdater;
