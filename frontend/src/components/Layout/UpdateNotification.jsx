import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const UpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    if (!window.electron) return;

    window.electron.onUpdateAvailable((info) => {
      setUpdateAvailable(true);
      setUpdateInfo(info);
    });

    window.electron.onDownloadProgress((progress) => {
      setDownloadProgress(progress.percent);
    });

    window.electron.onUpdateDownloaded((info) => {
      setUpdateDownloaded(true);
      setUpdateInfo(info);
    });
  }, []);

  const handleDownload = () => {
    if (window.electron) {
      window.electron.downloadUpdate();
    }
  };

  const handleInstall = () => {
    if (window.electron) {
      window.electron.installUpdate();
    }
  };

  if (!updateAvailable && !updateDownloaded) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-dark-card border border-primary rounded-lg shadow-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Download className="text-primary" size={20} />
          <h3 className="font-semibold">
            {updateDownloaded ? 'Atualização Pronta!' : 'Atualização Disponível'}
          </h3>
        </div>
        <button
          onClick={() => {
            setUpdateAvailable(false);
            setUpdateDownloaded(false);
          }}
          className="text-dark-muted hover:text-dark-text"
        >
          <X size={18} />
        </button>
      </div>

      {updateInfo && (
        <p className="text-sm text-dark-muted mb-3">
          Versão {updateInfo.version} disponível
        </p>
      )}

      {downloadProgress > 0 && downloadProgress < 100 && (
        <div className="mb-3">
          <div className="w-full bg-dark-border rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
          <p className="text-xs text-dark-muted mt-1">{downloadProgress.toFixed(0)}%</p>
        </div>
      )}

      {updateDownloaded ? (
        <button
          onClick={handleInstall}
          className="w-full btn-primary"
        >
          Reiniciar e Instalar
        </button>
      ) : (
        <button
          onClick={handleDownload}
          className="w-full btn-primary"
          disabled={downloadProgress > 0 && downloadProgress < 100}
        >
          {downloadProgress > 0 ? 'Baixando...' : 'Baixar Atualização'}
        </button>
      )}
    </div>
  );
};

export default UpdateNotification;
