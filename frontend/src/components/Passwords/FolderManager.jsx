import React, { useState, useEffect } from 'react';
import { Folder, Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import api from '../../api/api';

const FolderManager = ({ onSelectFolder, selectedFolderId }) => {
  const [folders, setFolders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📁',
    color: '#3b82f6'
  });

  const icons = ['📁', '🔐', '💼', '🏠', '🏦', '🎮', '🛒', '✈️', '🎓', '💳', '📱', '🌐', '⭐', '🔑', '💻', '🎯', '🎨', '🎵', '📧', '🏢', '🚗', '❤️', '🎁', '📚'];
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1'
  ];

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const response = await api.get('/password-folders');
      setFolders(response.data);
    } catch (error) {
      console.error('Erro ao carregar pastas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFolder) {
        await api.put(`/password-folders/${editingFolder.id}`, formData);
      } else {
        await api.post('/password-folders', formData);
      }
      setShowForm(false);
      setEditingFolder(null);
      resetForm();
      loadFolders();
    } catch (error) {
      console.error('Erro ao salvar pasta:', error);
      alert('Erro ao salvar pasta');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir esta pasta? As senhas não serão excluídas.')) return;
    
    try {
      await api.delete(`/password-folders/${id}`);
      loadFolders();
      if (selectedFolderId === id) {
        onSelectFolder(null);
      }
    } catch (error) {
      console.error('Erro ao excluir pasta:', error);
      alert('Erro ao excluir pasta');
    }
  };

  const handleEdit = (folder) => {
    setEditingFolder(folder);
    setFormData({
      name: folder.name,
      icon: folder.icon,
      color: folder.color
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '📁',
      color: '#3b82f6'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-dark-text">📂 Pastas</h3>
        <button
          onClick={() => {
            resetForm();
            setEditingFolder(null);
            setShowForm(!showForm);
          }}
          className="bg-primary text-white p-2 rounded-lg hover:bg-primary/80 transition-all"
        >
          <Plus size={18} />
        </button>
      </div>

      {showForm && (
        <div className="bg-dark-card border-2 border-dark-border rounded-xl p-4">
          <h4 className="font-semibold text-dark-text mb-4">
            {editingFolder ? '✏️ Editar Pasta' : '➕ Nova Pasta'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">Nome *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: Trabalho, Pessoal..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">Ícone</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-xl"
                style={{ fontFamily: 'system-ui' }}
              >
                {icons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon} {icon === '📁' ? 'Pasta' : icon === '🔐' ? 'Cadeado' : icon === '💼' ? 'Maleta' : icon === '🏠' ? 'Casa' : icon === '🏦' ? 'Banco' : icon === '🎮' ? 'Games' : icon === '🛒' ? 'Compras' : icon === '✈️' ? 'Viagem' : icon === '🎓' ? 'Educação' : icon === '💳' ? 'Cartão' : icon === '📱' ? 'Celular' : icon === '🌐' ? 'Web' : icon === '⭐' ? 'Favorito' : icon === '🔑' ? 'Chave' : icon === '💻' ? 'Computador' : icon === '🎯' ? 'Meta' : icon === '🎨' ? 'Arte' : icon === '🎵' ? 'Música' : icon === '📧' ? 'Email' : icon === '🏢' ? 'Trabalho' : icon === '🚗' ? 'Carro' : icon === '❤️' ? 'Favoritos' : icon === '🎁' ? 'Presente' : icon === '📚' ? 'Livros' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">Cor</label>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`h-10 rounded-lg transition-all ${
                      formData.color === color ? 'ring-4 ring-white scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/80 transition-all font-semibold"
              >
                {editingFolder ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingFolder(null);
                  resetForm();
                }}
                className="flex-1 bg-dark-border text-dark-text py-2 rounded-lg hover:bg-dark-border/70 transition-all font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={() => onSelectFolder(null)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            selectedFolderId === null
              ? 'bg-primary text-white'
              : 'bg-dark-card hover:bg-dark-border text-dark-text'
          }`}
        >
          <FolderOpen size={20} />
          <span className="font-medium">Todas as Senhas</span>
        </button>

        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              selectedFolderId === folder.id
                ? 'bg-primary/20 border-2 border-primary'
                : 'bg-dark-card hover:bg-dark-border border-2 border-dark-border'
            }`}
          >
            <button
              onClick={() => onSelectFolder(folder.id)}
              className="flex-1 flex items-center gap-3 text-left"
            >
              <span className="text-2xl">{folder.icon}</span>
              <span
                className="font-medium"
                style={{ color: selectedFolderId === folder.id ? folder.color : 'inherit' }}
              >
                {folder.name}
              </span>
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => handleEdit(folder)}
                className="p-2 hover:bg-dark-bg rounded-lg transition-all"
                title="Editar"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(folder.id)}
                className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
                title="Excluir"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderManager;
