import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, X } from 'lucide-react';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';

const UpdateNotification = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.electron) return;

    // Escutar quando atualização está disponível
    const unsubAvailable = window.electron.on('update-available', (info) => {
      console.log('🎉 Atualização disponível:', info);
      setUpdateInfo(info);
      setUpdateAvailable(true);
      setVisible(true);
    });

    // Escutar progresso do download
    const unsubProgress = window.electron.on('download-progress', (progressInfo) => {
      console.log('📥 Progresso:', progressInfo.percent + '%');
      setProgress(progressInfo.percent);
    });

    // Escutar quando download terminar
    const unsubDownloaded = window.electron.on('update-downloaded', (info) => {
      console.log('✅ Atualização baixada:', info);
      setUpdateDownloaded(true);
      setDownloading(false);
      setVisible(true);
    });

    return () => {
      if (unsubAvailable) unsubAvailable();
      if (unsubProgress) unsubProgress();
      if (unsubDownloaded) unsubDownloaded();
    };
  }, []);

  const handleDownload = () => {
    console.log('📥 Iniciando download da atualização...');
    setDownloading(true);
    window.electron.send('download-update');
  };

  const handleInstall = () => {
    console.log('🔄 Instalando atualização...');
    window.electron.send('install-update');
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up" style={{ maxWidth: '400px' }}>
      <GlassCard className="relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 hover:bg-white/10 rounded transition-colors"
          title="Fechar"
        >
          <X size={16} className="text-gray-400" />
        </button>

        {updateDownloaded ? (
          // Atualização baixada - mostrar botão de instalar
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <RefreshCw className="text-green-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Atualização Pronta!</h3>
                <p className="text-xs text-gray-400">
                  Versão {updateInfo?.version || 'nova'} baixada
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              A atualização foi baixada e está pronta para ser instalada. 
              O aplicativo será reiniciado.
            </p>
            <div className="flex gap-2">
              <GlassButton 
                variant="success" 
                onClick={handleInstall}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Reiniciar e Instalar
              </GlassButton>
              <GlassButton 
                variant="ghost" 
                onClick={handleDismiss}
              >
                Depois
              </GlassButton>
            </div>
          </div>
        ) : downloading ? (
          // Baixando atualização
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Download className="text-blue-400 animate-bounce" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Baixando Atualização</h3>
                <p className="text-xs text-gray-400">
                  Versão {updateInfo?.version || 'nova'}
                </p>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progresso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Aguarde enquanto baixamos a atualização...
            </p>
          </div>
        ) : (
          // Atualização disponível - mostrar botão de download
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Download className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Atualização Disponível!</h3>
                <p className="text-xs text-gray-400">
                  Versão {updateInfo?.version || 'nova'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Uma nova versão do FinancePass está disponível. 
              Deseja baixar agora?
            </p>
            <div className="flex gap-2">
              <GlassButton 
                variant="primary" 
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Baixar Agora
              </GlassButton>
              <GlassButton 
                variant="ghost" 
                onClick={handleDismiss}
              >
                Depois
              </GlassButton>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default UpdateNotification;
