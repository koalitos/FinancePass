import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Smartphone, Wifi, QrCode, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';

const MobileSync = () => {
  const toast = useToastContext();
  const [syncInfo, setSyncInfo] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const warningShownRef = useRef(false); // Controle para mostrar aviso apenas uma vez

  // Função para carregar dispositivos conectados
  const loadConnectedDevices = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sync/devices');
      const data = await response.json();
      setConnectedDevices(data.devices || []);
    } catch (error) {
      console.error('Erro ao carregar dispositivos:', error);
    }
  }, []);

  const generateQRCode = useCallback(async () => {
    setLoading(true);
    try {
      // Tentar /info primeiro (nova rota)
      let response = await fetch('http://localhost:3001/api/sync/info');
      let data;
      
      if (response.ok) {
        data = await response.json();
      } else {
        // Fallback: usar /status e buscar IP manualmente
        console.warn('Rota /info não disponível. Usando /status. Reinicie o backend para usar a nova rota.');
        response = await fetch('http://localhost:3001/api/sync/status');
        const statusData = await response.json();
        
        // Buscar IP local via API auxiliar
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Tentar obter IP local (isso não funcionará perfeitamente, mas é um fallback)
        // O ideal é reiniciar o backend para usar a rota /info
        data = {
          ip: ipData.ip || '192.168.1.1', // IP público como fallback
          port: statusData.port,
          token: 'REINICIE-O-BACKEND', // Indicador visual
          expiresIn: statusData.tokenExpiresIn || 300
        };
        
        // Mostrar aviso apenas uma vez
        if (!warningShownRef.current) {
          toast.warning('⚠️ Reinicie o backend para obter o IP correto!');
          warningShownRef.current = true;
        }
      }
      
      // Validar que temos um IP real
      if (!data.ip || data.ip === 'localhost' || data.ip === '127.0.0.1') {
        throw new Error('IP inválido. Verifique sua conexão de rede e reinicie o backend.');
      }
      
      setSyncInfo(data);
      setTimeLeft(data.expiresIn);

      // Gerar URL do QR Code usando API do Google Charts
      const qrData = JSON.stringify({
        ip: data.ip,
        port: data.port,
        token: data.token,
        type: 'financialpass_sync'
      });

      // QR Code preto e branco para melhor leitura
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(qrData)}`;
      setQrCodeUrl(qrUrl);

      // Remover notificação de sucesso para evitar spam
      loadConnectedDevices();
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code');
    } finally {
      setLoading(false);
    }
  }, [loadConnectedDevices, toast]);

  // Gerar QR Code automaticamente ao montar
  useEffect(() => {
    generateQRCode();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [generateQRCode]);

  // Timer para renovar QR Code
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Renovar automaticamente
            generateQRCode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [generateQRCode, timeLeft]);

  // Atualizar lista de dispositivos periodicamente
  useEffect(() => {
    loadConnectedDevices();
    const interval = setInterval(loadConnectedDevices, 5000); // A cada 5 segundos
    return () => clearInterval(interval);
  }, [loadConnectedDevices]);

  const disconnectDevice = async (deviceId) => {
    try {
      await fetch(`http://localhost:3001/api/sync/disconnect/${deviceId}`, {
        method: 'POST'
      });
      toast.success('Dispositivo desconectado');
      loadConnectedDevices();
    } catch (error) {
      toast.error('Erro ao desconectar dispositivo');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Smartphone className="text-primary" size={28} />
            Sincronização Mobile
          </h2>
          <p className="text-dark-muted mt-1">Conecte seu celular para sincronizar dados</p>
        </div>
        <button
          onClick={generateQRCode}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Renovar QR Code
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <QrCode className="text-primary" size={24} />
              QR Code de Conexão
            </h3>
            {timeLeft > 0 && (
              <div className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full">
                <Clock size={16} className="text-primary" />
                <span className="text-sm font-semibold text-primary">
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>

          <div className="bg-dark-bg rounded-xl p-6 flex flex-col items-center">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-[280px] h-[280px] rounded-xl shadow-lg bg-white p-4"
              />
            ) : (
              <div className="w-[280px] h-[280px] bg-dark-border rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <QrCode size={48} className="text-dark-muted mx-auto mb-2" />
                  <p className="text-dark-muted">Gerando QR Code...</p>
                </div>
              </div>
            )}
            
            {syncInfo && (
              <div className="mt-6 w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-muted">IP:</span>
                  <span className="font-mono font-semibold">{syncInfo.ip}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-muted">Porta:</span>
                  <span className="font-mono font-semibold">{syncInfo.port}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-muted">Status:</span>
                  <span className="flex items-center gap-1 text-success">
                    <Wifi size={14} />
                    Ativo
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              📱 <strong>Como conectar:</strong>
            </p>
            <ol className="text-sm text-blue-200 mt-2 space-y-1 ml-4 list-decimal">
              <li>Abra o app mobile do FinancialPass</li>
              <li>Toque em "Sincronizar"</li>
              <li>Escaneie este QR Code</li>
              <li>Aguarde a conexão automática</li>
            </ol>
          </div>

          <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <p className="text-sm text-green-300">
              ✨ <strong>Conexão Persistente:</strong> Após conectar pela primeira vez, seu celular se conectará automaticamente quando estiver na mesma rede!
            </p>
          </div>
        </div>

        {/* Dispositivos Conectados */}
        <div className="card">
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Wifi className="text-success" size={24} />
            Dispositivos Conectados
          </h3>

          {connectedDevices.length === 0 ? (
            <div className="bg-dark-bg rounded-xl p-8 text-center">
              <Smartphone size={48} className="text-dark-muted mx-auto mb-3" />
              <p className="text-dark-muted">Nenhum dispositivo conectado</p>
              <p className="text-sm text-dark-muted mt-2">
                Escaneie o QR Code com seu celular para conectar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {connectedDevices.map((device) => (
                <div
                  key={device.deviceId}
                  className="bg-dark-bg border border-dark-border rounded-xl p-4 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-success/20 p-2 rounded-lg">
                        <CheckCircle size={20} className="text-success" />
                      </div>
                      <div>
                        <p className="font-semibold">Dispositivo Mobile</p>
                        <p className="text-xs text-dark-muted font-mono">
                          ID: {device.deviceId.substring(0, 8)}...
                        </p>
                        <p className="text-xs text-dark-muted mt-1">
                          Conectado: {new Date(device.connectedAt).toLocaleString('pt-BR')}
                        </p>
                        {device.lastSync && (
                          <p className="text-xs text-success mt-1">
                            Última sinc: {new Date(device.lastSync).toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => disconnectDevice(device.deviceId)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Desconectar"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instruções */}
          <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <p className="text-sm text-purple-300 font-semibold mb-2">
              🔄 Sincronização Automática
            </p>
            <ul className="text-sm text-purple-200 space-y-1 ml-4 list-disc">
              <li>Dados sincronizam automaticamente ao conectar</li>
              <li>Celular reconecta sozinho na mesma rede</li>
              <li>Não precisa escanear QR Code novamente</li>
              <li>Sincronização bidirecional (PC ↔ Mobile)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Recursos de Sincronização</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-bg rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">🔐</div>
            <div className="text-sm text-dark-muted mt-2">Criptografia</div>
            <div className="text-xs text-dark-muted mt-1">AES-256</div>
          </div>
          <div className="bg-dark-bg rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">⚡</div>
            <div className="text-sm text-dark-muted mt-2">Tempo Real</div>
            <div className="text-xs text-dark-muted mt-1">WebSocket</div>
          </div>
          <div className="bg-dark-bg rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">🔄</div>
            <div className="text-sm text-dark-muted mt-2">Bidirecional</div>
            <div className="text-xs text-dark-muted mt-1">PC ↔ Mobile</div>
          </div>
          <div className="bg-dark-bg rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">📱</div>
            <div className="text-sm text-dark-muted mt-2">Auto-Conecta</div>
            <div className="text-xs text-dark-muted mt-1">Mesma Rede</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSync;
