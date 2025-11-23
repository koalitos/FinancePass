import React, { useState, useEffect } from 'react';
import { createPassword, updatePassword } from '../../api/api';
import { X, Eye, EyeOff } from 'lucide-react';

const PasswordForm = ({ password, onClose, onSave, selectedFolderId }) => {
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    email: '',
    password: '',
    url: '',
    notes: '',
    category: '',
    folder_id: selectedFolderId || '',
    favorite: false,
  });
  const [folders, setFolders] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadFolders();
    if (password) {
      setFormData({
        ...password,
        password: password.password_decrypted || '',
        favorite: password.favorite === 1,
      });
    } else if (selectedFolderId) {
      setFormData(prev => ({ ...prev, folder_id: selectedFolderId }));
    }
  }, [password, selectedFolderId]);

  const loadFolders = async () => {
    try {
      const response = await fetch('http://localhost:5174/api/password-folders');
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error('Erro ao carregar pastas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.title || !formData.password) {
      alert('Título e senha são obrigatórios!');
      return;
    }
    
    try {
      const data = { 
        ...formData, 
        favorite: formData.favorite ? 1 : 0,
        folder_id: formData.folder_id || null
      };
      
      console.log('Dados a serem enviados:', data);
      
      if (password) {
        const response = await updatePassword(password.id, data);
        console.log('Resposta da atualização:', response);
      } else {
        const response = await createPassword(data);
        console.log('Resposta da criação:', response);
      }
      onSave();
    } catch (error) {
      console.error('Erro completo ao salvar senha:', error);
      console.error('Resposta do erro:', error.response);
      const errorMessage = error.response?.data?.error || error.message || 'Erro desconhecido';
      alert(`Erro ao salvar senha: ${errorMessage}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">{password ? '✏️ Editar Senha' : '🔐 Nova Senha'}</h2>
              <p className="text-blue-100 mt-1">Armazene suas credenciais com segurança</p>
            </div>
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-card rounded-b-xl shadow-xl p-8 space-y-6 border border-dark-border max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-dark-text mb-2">📝 Título *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Ex: Gmail, Facebook, Netflix"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">👤 Usuário</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="seu_usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">📧 Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-text mb-2">🔑 Senha *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Digite uma senha forte"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-muted hover:text-dark-text transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">🌐 URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="https://exemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">📁 Pasta</label>
              <select
                value={formData.folder_id}
                onChange={(e) => setFormData({ ...formData, folder_id: e.target.value })}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Sem pasta</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.icon} {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-text mb-2">🏷️ Categoria</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Ex: Redes Sociais, Bancos"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-text mb-2">📋 Notas</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              rows="4"
              placeholder="Informações adicionais..."
            />
          </div>

          <div className="bg-dark-bg border border-dark-border p-4 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="favorite"
                checked={formData.favorite}
                onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
                className="w-5 h-5 text-yellow-500 rounded focus:ring-2 focus:ring-yellow-500"
              />
              <span className="text-sm font-medium text-dark-text">⭐ Marcar como favorito</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t-2 border-dark-border">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-dark-border text-dark-text py-4 px-6 rounded-xl hover:bg-dark-border/70 transition-all font-semibold text-lg"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {password ? '✅ Atualizar' : '✨ Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordForm;
