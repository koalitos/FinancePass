import React, { useState, useEffect } from 'react';
import { Download, X, RefreshCw, CheckCircle } from 'lucide-react';

const UpdateNotification = () => {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloaded, setDownloaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Verificar se está rodando no Electron
    if (!window.electron) return;

    // Listener para atualização disponível
    window.electron.on('update-available', (info) => {
      console.log('Atualização disponível:', info);
      setUpdateInfo(info);
      setVisible(true);
    });

    // Listener para progresso do download
    window.electron.on('download-progress', (progress) => {
      console.log('Progresso:', progress);
      setDownloadProgress(progress.percent);
    });

    // Listener para download completo
    window.electron.on('update-downloaded', (info) => {
      console.log('Download completo:', info);
      setDownloading(false);
      setDownloaded(true);
    });

    // Listener para quando começar a baixar
    window.electron.on('update-downloading', () => {
      console.log('Iniciando download...');
      setDownloading(true);
    });

    return () => {
      if (window.electron) {
        window.electron.removeAllListeners('update-available');
        window.electron.removeAllListeners('download-progress');
        window.electron.removeAllListeners('update-downloaded');
        window.electron.removeAllListeners('update-downloading');
      }
    };
  }, []);

  const handleDownload = () => {
    if (window.electron) {
      window.electron.send('download-update');
      setDownloading(true);
    }
  };

  const handleInstall = () => {
    if (window.electron) {
      window.electron.send('install-update');
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-96 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            {downloaded ? (
              <CheckCircle className="w-5 h-5" />
            ) : downloading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span className="font-semibold">
              {downloaded ? 'Atualização Pronta!' : downloading ? 'Baixando...' : 'Atualização Disponível'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 rounded p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {downloaded ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Versão <span className="font-semibold">{updateInfo?.version}</span> baixada com sucesso!
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                A atualização será instalada quando você fechar o app.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reiniciar Agora
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Depois
                </button>
              </div>
            </>
          ) : downloading ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Baixando versão <span className="font-semibold">{updateInfo?.version}</span>
              </p>
              
              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>{Math.round(downloadProgress)}%</span>
                  <span>
                    {downloadProgress.downloaded && downloadProgress.total
                      ? `${downloadProgress.downloaded}MB / ${downloadProgress.total}MB`
                      : 'Calculando...'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300 ease-out"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Você pode continuar usando o app enquanto baixa...
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Nova versão <span className="font-semibold">{updateInfo?.version}</span> disponível!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar Agora
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                  Depois
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;
