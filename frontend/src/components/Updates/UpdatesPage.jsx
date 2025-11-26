import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, CheckCircle, Clock, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import GlassCard from '../Common/GlassCard';
import GlassButton from '../Common/GlassButton';

const UpdatesPage = () => {
  const [currentVersion, setCurrentVersion] = useState('');
  const [latestVersion, setLatestVersion] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentVersion();
    loadReleases();
    setupUpdateListeners();
  }, []);

  const loadCurrentVersion = () => {
    // Versão atual do package.json
    setCurrentVersion('1.0.44'); // Você pode pegar isso dinamicamente
  };

  const loadReleases = async () => {
    try {
      // Buscar releases do GitHub
      const response = await fetch('https://api.github.com/repos/koalitos/FinancePass/releases');
      const data = await response.json();
      
      setReleases(data);
      
      if (data.length > 0) {
        const latest = data[0];
        setLatestVersion(latest.tag_name.replace('v', ''));
        
        // Verificar se há atualização disponível
        if (compareVersions(latest.tag_name.replace('v', ''), currentVersion) > 0) {
          setUpdateAvailable(true);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar releases:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupUpdateListeners = () => {
    if (!window.electron) return;

    window.electron.on('update-available', (info) => {
      setLatestVersion(info.version);
      setUpdateAvailable(true);
    });

    window.electron.on('download-progress', (progressInfo) => {
      setDownloadProgress(progressInfo.percent);
    });

    window.electron.on('update-downloaded', () => {
      setUpdateDownloaded(true);
      setDownloading(false);
    });
  };

  const compareVersions = (v1, v2) => {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }
    
    return 0;
  };

  const handleCheckForUpdates = () => {
    if (window.electron) {
      window.electron.send('check-for-updates');
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    if (window.electron) {
      window.electron.send('download-update');
    }
  };

  const handleInstall = () => {
    if (window.electron) {
      window.electron.send('install-update');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500/30 border-t-blue-500"></div>
            <span className="text-gray-300">Carregando atualizações...</span>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={28} className="text-blue-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Atualizações
          </h1>
        </div>
        <p className="text-gray-400 text-sm">Mantenha seu FinancePass sempre atualizado</p>
      </div>

      <div className="page-content space-y-6">
        {/* Status Atual */}
        <GlassCard gradient>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Versão Atual</h2>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-blue-400">v{currentVersion}</span>
                {!updateAvailable && (
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <CheckCircle size={16} />
                    <span>Atualizado</span>
                  </div>
                )}
              </div>
            </div>
            <GlassButton variant="secondary" onClick={handleCheckForUpdates}>
              <RefreshCw size={18} />
              Verificar Atualizações
            </GlassButton>
          </div>
        </GlassCard>

        {/* Atualização Disponível */}
        {updateAvailable && (
          <GlassCard className="border-blue-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Download className="text-blue-400" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-1">
                  Nova Versão Disponível!
                </h3>
                <p className="text-gray-400 mb-4">
                  Versão <span className="text-blue-400 font-semibold">v{latestVersion}</span> está disponível para download
                </p>

                {updateDownloaded ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle size={20} />
                      <span className="font-medium">Atualização baixada e pronta!</span>
                    </div>
                    <GlassButton 
                      variant="success" 
                      onClick={handleInstall}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw size={18} />
                      Reiniciar e Instalar Agora
                    </GlassButton>
                  </div>
                ) : downloading ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Clock size={20} className="animate-spin" />
                      <span className="font-medium">Baixando atualização...</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progresso</span>
                        <span>{Math.round(downloadProgress)}%</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <GlassButton 
                    variant="primary" 
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download size={18} />
                    Baixar Atualização
                  </GlassButton>
                )}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Histórico de Versões */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Clock size={24} className="text-purple-400" />
            Histórico de Versões
          </h2>

          <div className="space-y-4">
            {releases.map((release, index) => {
              const version = release.tag_name.replace('v', '');
              const isCurrent = version === currentVersion;
              const isNewer = compareVersions(version, currentVersion) > 0;

              return (
                <GlassCard key={release.id} className={isCurrent ? 'border-green-500/30' : ''}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {release.name || release.tag_name}
                        </h3>
                        {isCurrent && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-medium">
                            Instalada
                          </span>
                        )}
                        {isNewer && !isCurrent && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">
                            Nova
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-3">
                        Lançada em {formatDate(release.published_at)}
                      </p>

                      {release.body && (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <div 
                            className="text-gray-300 text-sm"
                            dangerouslySetInnerHTML={{ 
                              __html: release.body
                                .replace(/\n/g, '<br/>')
                                .replace(/#{1,6}\s/g, '<strong>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <a
                      href={release.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      <ExternalLink size={16} />
                      Ver no GitHub
                    </a>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {releases.length === 0 && (
            <GlassCard>
              <div className="text-center py-8">
                <AlertCircle size={48} className="mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">Nenhuma versão encontrada</p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdatesPage;
