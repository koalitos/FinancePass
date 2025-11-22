import React, { useState, useEffect } from 'react';
import { Download, X, RefreshCw } from 'lucide-react';

const AutoUpdater = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Verificar se está rodando no Electron
    if (window.electron) {
      // Listener para atualização disponível
      window.electron.onUpdateAvailable((info) => {
        console.log('Atualização disponível:', info);
        setUpdateInfo(info);
        setUpdateAvailable(true);
        setShowNotification(true);
      });

      // Listener para progresso do download
      window.electron.onDownloadProgress((progress) => {
        console.log('Progresso do download:', progress);
        setDownloading(true);
        setDownloadProgress(progress.percent);
      });

      // Listener para download completo
      window.electron.onUpdateDownloaded(() => {
        console.log('Atualização baixada');
        setDownloading(false);
        setDownloadProgress(100);
      });

      // Verificar atualizações ao iniciar
      checkForUpdates();

      // Verificar atualizações a cada 30 minutos
      const interval = setInterval(() => {
        checkForUpdates();
      }, 30 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const checkForUpdates = () => {
    if (window.electron) {
      window.electron.checkForUpdates();
    }
  };

  const downloadUpdate = () => {
    if (window.electron) {
      window.electron.downloadUpdate();
      setDownloading(true);
    }
  };

  const installUpdate = () => {
    if (window.electron) {
      window.electron.installUpdate();
    }
  };

  if (!updateAvailable || !showNotification) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-dark-card border-2 border-primary rounded-xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="bg-gradient-to-r from-primary to-blue-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Download className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Nova Atualização!</h3>
                <p className="text-blue-100 text-sm">
                  Versão {updateInfo?.version || 'mais recente'} disponível
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4">
          {downloading ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-text font-semibold">Baixando atualização...</span>
                <span className="text-primary font-bold">{Math.round(downloadProgress)}%</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-blue-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              {downloadProgress === 100 && (
                <button
                  onClick={installUpdate}
                  className="w-full bg-gradient-to-r from-success to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-success/90 hover:to-emerald-600/90 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Instalar e Reiniciar
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-dark-muted">
                Uma nova versão do FinancePass está disponível com melhorias e correções.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNotification(false)}
                  className="flex-1 bg-dark-border text-dark-text py-2 px-4 rounded-lg hover:bg-dark-border/70 transition-all font-semibold"
                >
                  Mais Tarde
                </button>
                <button
                  onClick={downloadUpdate}
                  className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white py-2 px-4 rounded-lg hover:from-primary/90 hover:to-blue-600/90 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Baixar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoUpdater;
