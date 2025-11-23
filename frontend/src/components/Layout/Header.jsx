import React, { useState, useEffect, useRef } from 'react';
import { Menu, LogOut, User, Edit2, X, Check, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '../Common/LanguageSelector';

const Header = ({ toggleSidebar, user, onLogout }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || 'Usuário');
  const [userPhoto, setUserPhoto] = useState(user?.photo || null);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSaveName = () => {
    const updatedUser = { ...user, name: newName, photo: userPhoto };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditingName(false);
    window.location.reload(); // Recarregar para atualizar o nome
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        setUserPhoto(photoData);
        const updatedUser = { ...user, name: user?.name || 'Usuário', photo: photoData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
        setIsEditingName(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="h-16 bg-dark-card border-b border-dark-border flex items-center justify-between px-6">
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-dark-border rounded-lg transition"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-4">
        <LanguageSelector />

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-dark-border rounded-lg transition"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {userPhoto ? (
                <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>
            <span className="text-sm font-semibold">{user?.name || 'Usuário'}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-dark-card border-2 border-dark-border rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-4 border-b border-dark-border bg-gradient-to-r from-primary/10 to-blue-600/10">
                {/* Avatar grande */}
                <div className="flex flex-col items-center mb-3">
                  <div className="relative group">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                      {userPhoto ? (
                        <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-white" />
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 size={20} className="text-white" />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                {isEditingName ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 px-3 py-2 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        placeholder="Digite seu nome"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveName}
                        className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
                      >
                        <Check size={16} />
                        Salvar
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          setNewName(user?.name || 'Usuário');
                        }}
                        className="px-3 py-2 bg-dark-border text-dark-text rounded-lg hover:bg-dark-border/70 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-dark-text">{user?.name || 'Usuário'}</p>
                      <p className="text-xs text-dark-muted mt-0.5">💰 FinancePass</p>
                    </div>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-2 hover:bg-primary/20 rounded-lg transition-all text-primary"
                      title="Editar nome"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/system');
                }}
                className="w-full px-4 py-3 text-left hover:bg-primary/10 flex items-center gap-3 text-primary font-semibold transition-all"
              >
                <Activity size={18} />
                <span>Status do Sistema</span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                className="w-full px-4 py-3 text-left hover:bg-red-500/10 flex items-center gap-3 text-red-500 font-semibold transition-all border-t border-dark-border"
              >
                <LogOut size={18} />
                <span>Desconectar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
