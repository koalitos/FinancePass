import React, { useState, useEffect } from 'react';
import { getPasswords, deletePassword, getPassword } from '../../api/api';
import { Plus, Search, Eye, EyeOff, Copy, Trash2, Edit, Star, Lock } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import PasswordForm from './PasswordForm';
import FolderManager from './FolderManager';
import PasswordProtection from './PasswordProtection';

const PasswordList = () => {
  const toast = useToastContext();
  const [passwords, setPasswords] = useState([]);
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    // Verificar se está desbloqueado no localStorage
    const unlocked = localStorage.getItem('passwordsUnlocked') === 'true';
    console.log('🔓 Estado inicial de desbloqueio:', unlocked);
    return unlocked;
  });

  const loadPasswords = async () => {
    try {
      const response = await getPasswords();
      setPasswords(response.data);
    } catch (error) {
      console.error('Erro ao carregar senhas:', error);
    }
  };

  useEffect(() => {
    loadPasswords();
  }, []);

  useEffect(() => {
    let filtered = passwords;

    // Filtrar por pasta
    if (selectedFolderId !== null) {
      filtered = filtered.filter(p => p.folder_id === selectedFolderId);
    }

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.url && p.url.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPasswords(filtered);
  }, [searchTerm, passwords, selectedFolderId]);

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta senha?')) {
      try {
        await deletePassword(id);
        loadPasswords();
      } catch (error) {
        console.error('Erro ao excluir senha:', error);
      }
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await getPassword(id);
      setEditingPassword(response.data);
      setShowForm(true);
    } catch (error) {
      console.error('Erro ao carregar senha:', error);
    }
  };

  const togglePasswordVisibility = async (id) => {
    if (visiblePasswords[id]) {
      // Se já está visível, apenas ocultar
      setVisiblePasswords(prev => ({ ...prev, [id]: false }));
    } else {
      // Buscar a senha descriptografada do backend
      try {
        const response = await getPassword(id);
        setVisiblePasswords(prev => ({ 
          ...prev, 
          [id]: response.data.password_decrypted 
        }));
      } catch (error) {
        console.error('Erro ao buscar senha:', error);
        toast.error('Erro ao visualizar senha');
      }
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    toast.success(`${field} copiado para área de transferência!`);
  };

  const handleUnlock = () => {
    console.log('🔓 Desbloqueando senhas...');
    setIsUnlocked(true);
    localStorage.setItem('passwordsUnlocked', 'true');
    console.log('✅ localStorage atualizado:', localStorage.getItem('passwordsUnlocked'));
  };

  const handleLock = () => {
    console.log('🔒 Bloqueando senhas...');
    setIsUnlocked(false);
    localStorage.removeItem('passwordsUnlocked');
    console.log('✅ localStorage limpo');
  };

  // Se não estiver desbloqueado, mostrar tela de proteção
  if (!isUnlocked) {
    return <PasswordProtection onUnlock={handleUnlock} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">🔐 Senhas</h1>
          <p className="text-dark-muted text-sm mt-1">
            Gerencie suas credenciais com segurança
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleLock}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-all"
            title="Bloquear senhas"
          >
            <Lock size={20} />
            Bloquear
          </button>
          <button
            onClick={() => {
              setEditingPassword(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Nova Senha
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar com pastas */}
        <div className="w-64 flex-shrink-0">
          <FolderManager 
            onSelectFolder={setSelectedFolderId}
            selectedFolderId={selectedFolderId}
          />
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-muted pointer-events-none" size={20} />
              <input
                type="text"
                placeholder="Buscar senhas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-card border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredPasswords.map((password) => (
              <div key={password.id} className="card hover:border-primary transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{password.title}</h3>
                    {password.favorite === 1 && <Star size={16} className="text-warning fill-warning" />}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(password.id)}
                      className="p-2 hover:bg-dark-border rounded transition-colors"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(password.id)}
                      className="p-2 hover:bg-danger/20 text-danger rounded transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {password.url && (
                  <div className="mb-3 p-2 bg-dark-bg rounded-lg">
                    <a 
                      href={password.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-2 truncate"
                    >
                      <span>🌐</span>
                      <span className="truncate">{password.url}</span>
                    </a>
                  </div>
                )}

                <div className="space-y-2">
                  {password.username && (
                    <div className="flex items-center justify-between gap-3 p-3 bg-dark-bg rounded-lg">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm text-dark-muted whitespace-nowrap">👤 Usuário:</span>
                        <span className="font-mono text-sm truncate">{password.username}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(password.username, 'Usuário')}
                        className="p-1.5 hover:bg-dark-border rounded transition-colors flex-shrink-0"
                        title="Copiar usuário"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 p-3 bg-dark-bg rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm text-dark-muted whitespace-nowrap">🔑 Senha:</span>
                      <span className="font-mono text-sm truncate">
                        {visiblePasswords[password.id] ? visiblePasswords[password.id] : '••••••••'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => togglePasswordVisibility(password.id)}
                        className="p-1.5 hover:bg-dark-border rounded transition-colors"
                        title={visiblePasswords[password.id] ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {visiblePasswords[password.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      {visiblePasswords[password.id] && (
                        <button
                          onClick={() => copyToClipboard(visiblePasswords[password.id], 'Senha')}
                          className="p-1.5 hover:bg-dark-border rounded transition-colors"
                          title="Copiar senha"
                        >
                          <Copy size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {password.category && (
                  <div className="mt-3 pt-3 border-t border-dark-border flex items-center gap-2">
                    <span className="text-xs text-dark-muted">🏷️</span>
                    <span className="text-xs bg-primary/20 text-primary px-2.5 py-1 rounded-full font-medium">
                      {password.category}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredPasswords.length === 0 && (
            <div className="text-center py-12 text-dark-muted">
              <Lock size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhuma senha encontrada</p>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <PasswordForm
          password={editingPassword}
          onClose={() => {
            setShowForm(false);
            setEditingPassword(null);
          }}
          onSave={() => {
            setShowForm(false);
            setEditingPassword(null);
            loadPasswords();
          }}
          selectedFolderId={selectedFolderId}
        />
      )}
    </div>
  );
};

export default PasswordList;
