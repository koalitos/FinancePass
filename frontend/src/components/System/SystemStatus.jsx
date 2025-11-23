import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Database, Server, Zap, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import api from '../../api/api';

const SystemStatus = () => {
  // const toast = useToastContext(); // Removido - não utilizado
  const [status, setStatus] = useState({
    backend: { status: 'checking', message: 'Verificando...', responseTime: null },
    database: { status: 'checking', message: 'Verificando...', tables: [] },
    frontend: { status: 'online', message: 'Online', version: require('../../../package.json').version },
    electron: { status: 'online', message: 'Online', version: null }
  });

  const checkDatabase = useCallback(async () => {
    try {
      const [expenses, incomes, debts, people, passwords] = await Promise.all([
        api.get('/expenses'),
        api.get('/incomes'),
        api.get('/debts'),
        api.get('/people'),
        api.get('/passwords')
      ]);

      setStatus(prev => ({
        ...prev,
        database: {
          status: 'online',
          message: 'Banco de Dados Online',
          tables: [
            { name: 'Despesas', count: expenses.data.length },
            { name: 'Receitas', count: incomes.data.length },
            { name: 'Dívidas', count: debts.data.length },
            { name: 'Pessoas', count: people.data.length },
            { name: 'Senhas', count: passwords.data.length }
          ]
        }
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        database: {
          status: 'warning',
          message: 'Erro ao acessar dados',
          tables: []
        }
      }));
    }
  }, []);

  const checkSystemStatus = useCallback(async () => {
    // Check Backend
    try {
      const startTime = Date.now();
      await api.get('/health');
      const responseTime = Date.now() - startTime;
      
      setStatus(prev => ({
        ...prev,
        backend: {
          status: 'online',
          message: 'Backend Online',
          responseTime: `${responseTime}ms`
        }
      }));

      // Check Database
      checkDatabase();
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        backend: {
          status: 'offline',
          message: 'Backend Offline',
          responseTime: null
        },
        database: {
          status: 'offline',
          message: 'Não conectado',
          tables: []
        }
      }));
    }

    // Check Electron
    if (window.electron) {
      setStatus(prev => ({
        ...prev,
        electron: {
          status: 'online',
          message: 'Electron Ativo',
          version: window.electron.version || 'N/A'
        }
      }));
    }
  }, [checkDatabase]);

  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 10000);
    return () => clearInterval(interval);
  }, [checkSystemStatus]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="text-success" size={24} />;
      case 'offline':
        return <XCircle className="text-danger" size={24} />;
      case 'warning':
        return <AlertCircle className="text-warning" size={24} />;
      default:
        return <Activity className="text-dark-muted animate-pulse" size={24} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'border-success';
      case 'offline':
        return 'border-danger';
      case 'warning':
        return 'border-warning';
      default:
        return 'border-dark-border';
    }
  };

  const components = [
    {
      name: 'Backend (Node.js)',
      icon: Server,
      data: status.backend,
      details: [
        { label: 'Porta', value: '5174' },
        { label: 'Tempo de Resposta', value: status.backend.responseTime || 'N/A' },
        { label: 'API', value: 'Express' }
      ]
    },
    {
      name: 'Frontend (React)',
      icon: Zap,
      data: status.frontend,
      details: [
        { label: 'Porta', value: '5173' },
        { label: 'Versão', value: status.frontend.version },
        { label: 'Framework', value: 'React 19' }
      ]
    },
    {
      name: 'Banco de Dados (SQLite)',
      icon: Database,
      data: status.database,
      details: status.database.tables.length > 0 
        ? status.database.tables.map(t => ({ label: t.name, value: `${t.count} registros` }))
        : [{ label: 'Status', value: 'Aguardando conexão' }]
    },
    {
      name: 'Electron',
      icon: Activity,
      data: status.electron,
      details: [
        { label: 'Status', value: status.electron.message },
        { label: 'Versão', value: status.electron.version || 'N/A' },
        { label: 'Modo', value: 'Desktop' }
      ]
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">⚙️ Status do Sistema</h1>
          <p className="text-dark-muted mt-1">Monitoramento em tempo real</p>
        </div>
        <button 
          onClick={checkSystemStatus}
          className="btn-primary flex items-center gap-2"
        >
          <Activity size={20} />
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {components.map((component, index) => {
          const Icon = component.icon;
          return (
            <div 
              key={index} 
              className={`card border-l-4 ${getStatusColor(component.data.status)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-dark-bg rounded-lg">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{component.name}</h3>
                    <p className="text-sm text-dark-muted">{component.data.message}</p>
                  </div>
                </div>
                {getStatusIcon(component.data.status)}
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-dark-border">
                {component.details.map((detail, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-dark-muted">{detail.label}:</span>
                    <span className="font-semibold">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo Geral */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Resumo Geral</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-dark-bg rounded-lg">
            <div className="text-2xl font-bold text-success">
              {Object.values(status).filter(s => s.status === 'online').length}
            </div>
            <div className="text-sm text-dark-muted mt-1">Online</div>
          </div>
          <div className="text-center p-4 bg-dark-bg rounded-lg">
            <div className="text-2xl font-bold text-danger">
              {Object.values(status).filter(s => s.status === 'offline').length}
            </div>
            <div className="text-sm text-dark-muted mt-1">Offline</div>
          </div>
          <div className="text-center p-4 bg-dark-bg rounded-lg">
            <div className="text-2xl font-bold text-warning">
              {Object.values(status).filter(s => s.status === 'warning').length}
            </div>
            <div className="text-sm text-dark-muted mt-1">Avisos</div>
          </div>
          <div className="text-center p-4 bg-dark-bg rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {status.database.tables.reduce((sum, t) => sum + t.count, 0)}
            </div>
            <div className="text-sm text-dark-muted mt-1">Registros</div>
          </div>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Informações do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-dark-muted">Versão do App:</span>
            <span className="ml-2 font-semibold">{require('../../../package.json').version}</span>
          </div>
          <div>
            <span className="text-dark-muted">Ambiente:</span>
            <span className="ml-2 font-semibold">
              {process.env.NODE_ENV || 'development'}
            </span>
          </div>
          <div>
            <span className="text-dark-muted">Plataforma:</span>
            <span className="ml-2 font-semibold">
              {navigator.platform}
            </span>
          </div>
        </div>
      </div>

      {/* Backup e Gerenciamento de Dados */}
      <DataManagement />
    </div>
  );
};

// Componente de Gerenciamento de Dados
const DataManagement = () => {
  const toast = useToastContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [password, setPassword] = useState('');
  const [backupPassword, setBackupPassword] = useState('');
  const [restorePassword, setRestorePassword] = useState('');
  const [restoreFile, setRestoreFile] = useState(null);
  const [error, setError] = useState('');
  const [restoring, setRestoring] = useState(false);

  const handleBackup = async () => {
    if (!backupPassword) {
      setError('Digite uma senha para criptografar o backup');
      return;
    }

    try {
      setShowBackupModal(false);
      const [expenses, incomes, debts, people, passwords, categories] = await Promise.all([
        api.get('/expenses'),
        api.get('/incomes'),
        api.get('/debts'),
        api.get('/people'),
        api.get('/passwords'),
        api.get('/categories')
      ]);

      const backup = {
        version: require('../../../package.json').version,
        date: new Date().toISOString(),
        encrypted: true,
        data: {
          expenses: expenses.data,
          incomes: incomes.data,
          debts: debts.data,
          people: people.data,
          passwords: passwords.data,
          categories: categories.data
        }
      };

      // Criptografar o backup
      const backupString = JSON.stringify(backup);
      const encryptedData = await encryptBackup(backupString, backupPassword);

      const blob = new Blob([JSON.stringify({
        version: require('../../../package.json').version,
        encrypted: true,
        date: new Date().toISOString(),
        data: encryptedData
      }, null, 2)], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financialpass-backup-encrypted-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Backup criptografado criado com sucesso!');
      setBackupPassword('');
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast.error('Erro ao criar backup');
    }
  };

  const openBackupModal = () => {
    setBackupPassword('');
    setError('');
    setShowBackupModal(true);
  };

  // Função para criptografar usando Web Crypto API
  const encryptBackup = async (data, password) => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Derivar chave da senha
    const passwordBuffer = encoder.encode(password);
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      dataBuffer
    );

    // Combinar salt + iv + dados criptografados
    const result = new Uint8Array(salt.length + iv.length + encryptedBuffer.byteLength);
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encryptedBuffer), salt.length + iv.length);

    // Converter para base64
    return btoa(String.fromCharCode(...result));
  };

  // Função para descriptografar backup
  const decryptBackup = async (encryptedData, password) => {
    try {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      
      // Converter de base64
      const encryptedBytes = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      // Extrair salt, iv e dados
      const salt = encryptedBytes.slice(0, 16);
      const iv = encryptedBytes.slice(16, 28);
      const data = encryptedBytes.slice(28);

      // Derivar chave da senha
      const passwordBuffer = encoder.encode(password);
      const passwordKey = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        passwordKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        data
      );

      return decoder.decode(decryptedBuffer);
    } catch (error) {
      throw new Error('Senha incorreta ou arquivo corrompido');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setRestoreFile(file);
      setRestorePassword('');
      setError('');
      setShowRestoreModal(true);
    }
    event.target.value = '';
  };

  const handleRestore = async () => {
    if (!restorePassword) {
      setError('Digite a senha do backup');
      return;
    }

    if (!restoreFile) {
      toast.error('Nenhum arquivo selecionado');
      return;
    }

    setRestoring(true);

    try {
      const fileContent = await restoreFile.text();
      const backupFile = JSON.parse(fileContent);

      if (!backupFile.encrypted) {
        toast.error('Este backup não está criptografado');
        setRestoring(false);
        return;
      }

      // Descriptografar
      const decryptedData = await decryptBackup(backupFile.data, restorePassword);
      const backup = JSON.parse(decryptedData);

      setShowRestoreModal(false);

      // Restaurar dados
      const promises = [];
      
      if (backup.data.expenses) {
        backup.data.expenses.forEach(item => {
          promises.push(api.post('/expenses', item).catch(() => {}));
        });
      }
      
      if (backup.data.incomes) {
        backup.data.incomes.forEach(item => {
          promises.push(api.post('/incomes', item).catch(() => {}));
        });
      }

      if (backup.data.people) {
        backup.data.people.forEach(item => {
          promises.push(api.post('/people', item).catch(() => {}));
        });
      }

      if (backup.data.debts) {
        backup.data.debts.forEach(item => {
          promises.push(api.post('/debts', item).catch(() => {}));
        });
      }

      await Promise.all(promises);

      toast.success('Backup restaurado com sucesso!');
      setRestorePassword('');
      setRestoreFile(null);
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast.error(error.message || 'Erro ao restaurar backup');
      setRestoring(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!password) {
      setError('Digite sua senha');
      return;
    }

    // Validar senha localmente
    const savedPassword = localStorage.getItem('masterPassword');
    const hashedPassword = btoa(password);

    if (savedPassword !== hashedPassword) {
      setError('Senha incorreta');
      return;
    }

    // Senha correta, deletar tudo
    if (window.confirm('⚠️ ATENÇÃO! Esta ação é IRREVERSÍVEL!\n\nTodos os seus dados serão PERMANENTEMENTE excluídos:\n- Despesas\n- Receitas\n- Dívidas\n- Pessoas\n- Senhas\n- Categorias\n\nDeseja realmente continuar?')) {
      try {
        await Promise.all([
          api.delete('/expenses').catch(() => {}),
          api.delete('/incomes').catch(() => {}),
          api.delete('/debts').catch(() => {}),
          api.delete('/people').catch(() => {}),
          api.delete('/passwords').catch(() => {})
        ]);

        toast.success('Todos os dados foram excluídos');
        setShowDeleteConfirm(false);
        setPassword('');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        setError('Erro ao excluir dados');
      }
    }
  };

  return (
    <>
      {/* Modal de Backup */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl shadow-2xl max-w-md w-full border border-dark-border">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-xl">
              <h3 className="text-xl font-bold text-white">🔒 Criar Backup Criptografado</h3>
              <p className="text-blue-100 text-sm mt-1">Digite uma senha para proteger seus dados</p>
            </div>
            <div className="p-6">
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-300">
                  💡 <strong>Importante:</strong> Guarde esta senha em local seguro. Você precisará dela para restaurar o backup.
                </p>
              </div>
              <input
                type="password"
                value={backupPassword}
                onChange={(e) => {
                  setBackupPassword(e.target.value);
                  setError('');
                }}
                placeholder="Digite uma senha forte"
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleBackup}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold"
                >
                  Criar Backup
                </button>
                <button
                  onClick={() => {
                    setShowBackupModal(false);
                    setBackupPassword('');
                    setError('');
                  }}
                  className="flex-1 bg-dark-border text-dark-text py-3 px-4 rounded-lg hover:bg-dark-border/70 transition-all font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Restauração */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl shadow-2xl max-w-md w-full border border-dark-border">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-xl">
              <h3 className="text-xl font-bold text-white">📂 Restaurar Backup</h3>
              <p className="text-green-100 text-sm mt-1">Digite a senha do backup</p>
            </div>
            <div className="p-6">
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-300">
                  ⚠️ <strong>Atenção:</strong> Esta ação substituirá todos os dados atuais!
                </p>
              </div>
              {restoreFile && (
                <div className="bg-dark-bg rounded-lg p-3 mb-4">
                  <p className="text-sm text-dark-muted">Arquivo selecionado:</p>
                  <p className="text-sm font-semibold text-dark-text truncate">{restoreFile.name}</p>
                </div>
              )}
              <input
                type="password"
                value={restorePassword}
                onChange={(e) => {
                  setRestorePassword(e.target.value);
                  setError('');
                }}
                placeholder="Digite a senha do backup"
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleRestore}
                  disabled={restoring}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {restoring ? 'Restaurando...' : 'Restaurar'}
                </button>
                <button
                  onClick={() => {
                    setShowRestoreModal(false);
                    setRestorePassword('');
                    setRestoreFile(null);
                    setError('');
                  }}
                  disabled={restoring}
                  className="flex-1 bg-dark-border text-dark-text py-3 px-4 rounded-lg hover:bg-dark-border/70 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-t-xl p-6 text-white">
          <h2 className="text-2xl font-bold">⚠️ Gerenciamento de Dados</h2>
          <p className="text-orange-100 mt-1">Backup e exclusão de dados</p>
        </div>

      <div className="bg-dark-card rounded-b-xl shadow-xl p-8 border border-dark-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Backup */}
          <div className="bg-dark-bg border-2 border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Database size={24} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Backup Criptografado</h3>
                <p className="text-sm text-dark-muted">Exportar dados protegidos</p>
              </div>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-300">
                🔐 <strong>Segurança:</strong> Seus dados serão criptografados com AES-256-GCM usando sua senha
              </p>
            </div>
            <p className="text-sm text-dark-muted mb-4">
              Crie um backup completo e criptografado de todos os seus dados. Você precisará da mesma senha para restaurar.
            </p>
            <button
              onClick={openBackupModal}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              🔒 Fazer Backup Criptografado
            </button>
          </div>

          {/* Restaurar Backup */}
          <div className="bg-dark-bg border-2 border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Database size={24} className="text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Restaurar Backup</h3>
                <p className="text-sm text-dark-muted">Importar dados protegidos</p>
              </div>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-300">
                📥 <strong>Restauração:</strong> Carregue um backup criptografado para restaurar seus dados
              </p>
            </div>
            <p className="text-sm text-dark-muted mb-4">
              Selecione um arquivo de backup criptografado. Você precisará da senha usada na criação do backup.
            </p>
            <label className="w-full block">
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                disabled={restoring}
                className="hidden"
                id="restore-backup-input"
              />
              <div className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl text-center cursor-pointer">
                {restoring ? '⏳ Restaurando...' : '📂 Carregar Backup'}
              </div>
            </label>
          </div>

          {/* Deletar Tudo */}
          <div className="bg-dark-bg border-2 border-red-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500/20 p-3 rounded-lg">
                <XCircle size={24} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Apagar Todos os Dados</h3>
                <p className="text-sm text-dark-muted">Ação irreversível</p>
              </div>
            </div>
            <p className="text-sm text-dark-muted mb-4">
              ⚠️ Esta ação excluirá PERMANENTEMENTE todos os seus dados. Faça um backup antes de continuar!
            </p>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all font-semibold"
              >
                🗑️ Apagar Tudo
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Digite sua senha para confirmar"
                  className="w-full px-4 py-3 bg-dark-card border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAll}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all font-semibold"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setPassword('');
                      setError('');
                    }}
                    className="flex-1 bg-dark-border text-dark-text py-2 px-4 rounded-lg hover:bg-dark-border/70 transition-all font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default SystemStatus;
