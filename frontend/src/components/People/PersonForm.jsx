import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MessageSquare, Palette } from 'lucide-react';
import { useEscapeKey } from '../../hooks/useEscapeKey';

const AVATAR_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
];

const PersonForm = ({ onClose, onSave, person }) => {
  // Fechar modal com ESC
  useEscapeKey(onClose);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    notes: '',
    avatar_color: AVATAR_COLORS[0]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name || '',
        relationship: person.relationship || '',
        phone: person.phone || '',
        email: person.email || '',
        notes: person.notes || '',
        avatar_color: person.avatar_color || AVATAR_COLORS[0]
      });
    }
  }, [person]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-xl shadow-2xl max-w-2xl w-full border border-dark-border max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <User size={28} />
                {person ? 'Editar Pessoa' : 'Nova Pessoa'}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {person ? 'Atualize as informações da pessoa' : 'Adicione uma nova pessoa ao sistema'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg"
              style={{ backgroundColor: formData.avatar_color }}
            >
              {formData.name.charAt(0).toUpperCase() || '?'}
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <User size={16} className="text-primary" />
              Nome *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite o nome completo"
              className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                errors.name ? 'border-red-500' : 'border-dark-border'
              } text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
              autoFocus
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Relacionamento */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Relacionamento <span className="text-dark-muted font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              placeholder="Ex: Mãe, Amigo, Colega..."
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Telefone e Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                Telefone <span className="text-dark-muted font-normal">(opcional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                Email <span className="text-dark-muted font-normal">(opcional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Cor do Avatar */}
          <div>
            <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
              <Palette size={16} className="text-primary" />
              Cor do Avatar
            </label>
            <div className="flex flex-wrap gap-3">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, avatar_color: color }))}
                  className={`w-12 h-12 rounded-full transition-all ${
                    formData.avatar_color === color
                      ? 'ring-4 ring-primary ring-offset-2 ring-offset-dark-card scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <MessageSquare size={16} className="text-primary" />
              Notas <span className="text-dark-muted font-normal">(opcional)</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Observações adicionais..."
              rows={3}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-dark-border">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg"
            >
              {person ? 'Atualizar' : 'Adicionar'} Pessoa
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-dark-border text-dark-text py-3 px-6 rounded-lg hover:bg-dark-border/70 transition-all font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonForm;
