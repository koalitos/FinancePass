import React, { useState } from 'react';
import { X } from 'lucide-react';

const IncomeForm = ({ onClose, onSave, income = null }) => {
  const [formData, setFormData] = useState({
    description: income?.description || '',
    amount: income?.amount || '',
    source: income?.source || '',
    date: income?.date || new Date().toISOString().split('T')[0],
    notes: income?.notes || ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Valor deve ser maior que zero';
    if (!formData.source.trim()) newErrors.source = 'Fonte é obrigatória';
    if (!formData.date) newErrors.date = 'Data é obrigatória';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(formData);
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
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">{income ? '✏️ Editar Receita' : '💰 Nova Receita'}</h2>
              <p className="text-green-100 mt-1">Registre suas receitas e ganhos</p>
            </div>
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-card rounded-b-xl shadow-xl p-8 space-y-6 border border-dark-border max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-dark-text mb-2">📝 Descrição *</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-dark-bg border-2 text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.description ? 'border-red-500' : 'border-dark-border focus:border-green-500'}`}
              placeholder="Ex: Salário, Freelance, Investimentos..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">💰 Valor *</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-dark-muted font-semibold">R$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-dark-bg border-2 text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.amount ? 'border-red-500' : 'border-dark-border focus:border-green-500'}`}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">📅 Data *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark-bg border-2 text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.date ? 'border-red-500' : 'border-dark-border focus:border-green-500'}`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-text mb-2">🏢 Fonte *</label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-dark-bg border-2 text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${errors.source ? 'border-red-500' : 'border-dark-border focus:border-green-500'}`}
              placeholder="Ex: Empresa XYZ, Cliente João, Investimentos..."
            />
            {errors.source && <p className="text-red-500 text-sm mt-1">{errors.source}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-text mb-2">📋 Observações</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
              rows="4"
              placeholder="Informações adicionais sobre esta receita..."
            />
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
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {income ? '✅ Atualizar' : '✨ Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeForm;
