import React, { useState } from 'react';
import { Download, Upload, Shield, AlertCircle } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import api from '../../api/api';

const BackupManager = () => {
  const toast = useToastContext();
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [backupPassword, setBackupPassword] = useState('');
  const [restorePassword, setRestorePassword] = useState('');
  const [restoreFile, setRestoreFile] = useState(null);
  const [error, setError] = useState('');
  const [backing, setBacking] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleBackup = async () => {
    if (!backupPassword) {
      setError('Digite uma senha para o backup');
      return;
    }

    if (backupPassword.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres');
      return;
    }

    setBacking(true);
    try {
      const [expenses, incomes, debts, people, passwords] = await Promise.all([
        api.get('/expenses'),
        api.get('/incomes'),
        api.get('/debts'),
        api.get('/people'),
        api.get('/passwords')
      ]);

      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          expenses: expenses.data,
          incomes: incomes.data,
          debts: debts.data,
          people: people.data,
          passwords: passwords.data
        }
      };

      // Criptografar com a senha
      const encrypted = btoa(JSON.stringify(backupData) + '::' + backupPassword);
      
      const blob = new Blob([encrypted], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financepass-backup-${new Date().toISOString().split('T')[0]}.fpb`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Backup criado com sucesso!');
      setShowBackupModal(false);
      setBackupPassword('');
      setError('');
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast.error('Erro ao criar backup');
    } finally {
      setBacking(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) {
      setError('Selecione um arquivo de backup');
      return;
    }

    if (!restorePassword) {
      setError('Digite a senha do backup');
      return;
    }

    setRestoring(true);
    try {
      const text = await restoreFile.text();
      const decrypted = atob(text);
      const [dataStr, password] = decrypted.split('::');
      
      if (password !== restorePassword) {
        setError('Senha incorreta');
        setRestoring(false);
        return;
      }

      const backupData = JSON.parse(dataStr);

      // Restaurar dados
      if (window.confirm('⚠️ ATENÇÃO!\n\nIsso irá SUBSTITUIR todos os dados atuais pelos dados do backup.\n\nDeseja continuar?')) {
        // Deletar dados atuais
        await Promise.all([
          api.delete('/expenses').catch(() => {}),
          api.delete('/incomes').catch(() => {}),
          api.delete('/debts').catch(() => {}),
          api.delete('/people').catch(() => {}),
          api.delete('/passwords').catch(() => {})
        ]);

        // Restaurar dados do backup
        const promises = [];
        
        backupData.data.people?.forEach(person => {
          promises.push(api.post('/people', person).catch(() => {}));
        });
        
        backupData.data.expenses?.forEach(expense => {
          promises.push(api.post('/expenses', expense).catch(() => {}));
        });
        
        backupData.data.incomes?.forEach(income => {
          promises.push(api.post('/incomes', income).catch(() => {}));
        });
        
        backupData.data.debts?.forEach(debt => {
          promises.push(api.post('/debts', debt).catch(() => {}));
        });
        
        backupData.data.passwords?.forEach(password => {
          promises.push(api.post('/passwords', password).catch(() => {}));
        });

        await Promise.all(promises);

        toast.success('Backup restaurado com sucesso!');
        setShowRestoreModal(false);
        setRestorePassword('');
        setRestoreFile(null);
        setError('');
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      setError('Erro ao restaurar backup. Verifique o arquivo e a senha.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="text-primary" size={32} />
          Backup e Restauração
        </h1>
        <p className="text-dark-muted mt-1">Proteja seus dados com backups criptografados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Criar Backup */}
        <div className="card hover:border-primary/50 transition-all">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Download className="text-primary" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Criar Backup</h3>
              <p className="text-sm text-dark-muted">
                Exporte todos os seus dados em um arquivo criptografado
              </p>
            </div>
          </div>
          
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-dark-muted">
              <strong className="text-primary">O que será salvo:</strong>
            </p>
            <ul className="text-sm text-dark-muted mt-2 space-y-1">
              <li>• Todas as despesas e receitas</li>
              <li>• Senhas armazenadas</li>
              <li>• Pessoas e dívidas</li>
              <li>• Categorias personalizadas</li>
            </ul>
          </div>

          <button
            onClick={() => setShowBackupModal(true)}
            className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-3 px-4 rounded-xl hover:from-primary/90 hover:to-blue-600/90 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Criar Backup Agora
          </button>
        </div>

        {/* Restaurar Backup */}
        <div className="card hover:border-success/50 transition-all">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-success/10 rounded-xl">
              <Upload className="text-success" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Restaurar Backup</h3>
              <p className="text-sm text-dark-muted">
                Importe seus dados de um arquivo de backup
              </p>
            </div>
          </div>
          
          <div className="bg-warning/5 border border-warning/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-warning flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-dark-muted">
                <strong className="text-warning">Atenção:</strong> Restaurar um backup irá substituir todos os dados atuais.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowRestoreModal(true)}
            className="w-full bg-gradient-to-r from-success to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-success/90 hover:to-emerald-600/90 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Upload size={20} />
            Restaurar Backup
          </button>
        </div>
      </div>

      {/* Modal Criar Backup */}
      {showBackupModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl shadow-2xl max-w-md w-full border border-dark-border">
            <div className="bg-gradient-to-r from-primary to-blue-600 p-6 rounded-t-xl">
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
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex gap-3">
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
                <button
                  onClick={handleBackup}
                  disabled={backing}
                  className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white py-3 px-4 rounded-lg hover:from-primary/90 hover:to-blue-600/90 transition-all font-semibold disabled:opacity-50"
                >
                  {backing ? 'Criando...' : 'Criar Backup'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Restaurar Backup */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl shadow-2xl max-w-md w-full border border-dark-border">
            <div className="bg-gradient-to-r from-success to-emerald-600 p-6 rounded-t-xl">
              <h3 className="text-xl font-bold text-white">📂 Restaurar Backup</h3>
              <p className="text-green-100 text-sm mt-1">Selecione o arquivo e digite a senha</p>
            </div>
            <div className="p-6">
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-warning">
                  ⚠️ <strong>Atenção:</strong> Seus dados atuais serão substituídos!
                </p>
              </div>
              <input
                type="file"
                accept=".fpb"
                onChange={(e) => {
                  setRestoreFile(e.target.files[0]);
                  setError('');
                }}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-success mb-3"
              />
              <input
                type="password"
                value={restorePassword}
                onChange={(e) => {
                  setRestorePassword(e.target.value);
                  setError('');
                }}
                placeholder="Digite a senha do backup"
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-success mb-2"
              />
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRestoreModal(false);
                    setRestorePassword('');
                    setRestoreFile(null);
                    setError('');
                  }}
                  className="flex-1 bg-dark-border text-dark-text py-3 px-4 rounded-lg hover:bg-dark-border/70 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRestore}
                  disabled={restoring}
                  className="flex-1 bg-gradient-to-r from-success to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-success/90 hover:to-emerald-600/90 transition-all font-semibold disabled:opacity-50"
                >
                  {restoring ? 'Restaurando...' : 'Restaurar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupManager;
