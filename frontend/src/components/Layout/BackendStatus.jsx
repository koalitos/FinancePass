import React, { useState, useEffect } from 'react';
import { Server, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';

const BackendStatus = () => {
  const [backendStatus, setBackendStatus] = useState('checking'); // checking, online, offline
  const [isRestarting, setIsRestarting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const toast = useToastContext();

  useEffect(() => {
    checkBackendStatus();
    
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkBackendStatus, 30000);
    
    // Listener para quando o backend for reiniciado
    if (window.electron && typeof window.electron.on === 'function') {
      const unsubscribe = window.electron.on('backend-restarted', (result) => {
        setIsRestarting(false);
        if (result.success) {
          toast.success('Backend reiniciado com sucesso!');
          setBackendStatus('online');
        } else {
          toast.error('Erro ao reiniciar backend: ' + result.error);
          setBackendStatus('offline');
        }
      });
      
      return () => {
        clearInterval(interval);
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
    
    return () => clearInterval(interval);
  }, [toast]);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5174/api/dashboard/summary', {
        method: 'GET',
        signal: AbortSignal.timeout(3000) // Timeout de 3 segundos
      });
      
      if (response.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  const handleRestartBackend = () => {
    if (!toast) {
      console.error('Toast não está disponível');
      return;
    }
    
    if (!window.electron || typeof window.electron.send !== 'function') {
      toast.error('Função disponível apenas no app desktop');
      return;
    }
    
    setIsRestarting(true);
    toast.info('Reiniciando backend... Aguarde alguns segundos.');
    window.electron.send('restart-backend');
  };

  // Não mostrar nada se estiver online
  if (backendStatus === 'online' && !showDetails) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {backendStatus === 'offline' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm shadow-lg max-w-sm">
          <div className="flex items-start gap-3">
            <div className="bg-red-500/20 p-2 rounded-lg flex-shrink-0">
              <AlertCircle className="text-red-500" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-red-500 font-semibold text-sm mb-1">
                Backend Offline
              </h3>
              <p className="text-red-400 text-xs mb-3">
                O servidor backend não está respondendo. Algumas funcionalidades podem não funcionar.
              </p>
              <button
                onClick={handleRestartBackend}
                disabled={isRestarting}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:cursor-not-allowed"
              >
                <RefreshCw size={14} className={isRestarting ? 'animate-spin' : ''} />
                {isRestarting ? 'Reiniciando...' : 'Reiniciar Backend'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {backendStatus === 'checking' && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2">
            <RefreshCw className="text-yellow-500 animate-spin" size={16} />
            <span className="text-yellow-500 text-xs font-medium">
              Verificando backend...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendStatus;
