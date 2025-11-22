import React, { useState, useEffect } from 'react';
import { X, DollarSign, User, Calendar, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { getPeople } from '../../api/api';

const DebtForm = ({ onClose, onSave, debt }) => {
  const [people, setPeople] = useState([]);
  const [formData, setFormData] = useState({
    person_id: '',
    description: '',
    total_amount: '',
    type: 'owes_me',
    due_date: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPeople();
    if (debt) {
      setFormData({
        person_id: debt.person_id || '',
        description: debt.description || '',
        total_amount: debt.total_amount || '',
        type: debt.type || 'owes_me',
        due_date: debt.due_date || '',
        notes: debt.notes || ''
      });
    }
  }, [debt]);

  const loadPeople = async () => {
    try {
      const response = await getPeople();
      setPeople(response.data);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.person_id) {
      newErrors.person_id = 'Selecione uma pessoa';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    if (!formData.total_amount || parseFloat(formData.total_amount) <= 0) {
      newErrors.total_amount = 'Valor deve ser maior que zero';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        total_amount: parseFloat(formData.total_amount)
      });
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
        <div className={`p-6 rounded-t-xl sticky top-0 z-10 ${
          formData.type === 'owes_me'
            ? 'bg-gradient-to-r from-green-600 to-emerald-600'
            : 'bg-gradient-to-r from-red-600 to-rose-600'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <DollarSign size={28} />
                {debt ? 'Editar Dívida' : 'Nova Dívida'}
              </h2>
              <p className="text-white/90 text-sm mt-1">
                {debt ? 'Atualize as informações da dívida' : 'Registre uma nova dívida'}
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
          {/* Tipo de Dívida */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Tipo de Dívida *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'owes_me' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'owes_me'
                    ? 'border-green-500 bg-green-500/20 text-green-400'
                    : 'border-dark-border bg-dark-bg text-dark-muted hover:border-green-500/50'
                }`}
              >
                <TrendingUp size={24} className="mx-auto mb-2" />
                <p className="font-semibold">Me Devem</p>
                <p className="text-xs mt-1 opacity-75">Dinheiro a receber</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'i_owe' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'i_owe'
                    ? 'border-red-500 bg-red-500/20 text-red-400'
                    : 'border-dark-border bg-dark-bg text-dark-muted hover:border-red-500/50'
                }`}
              >
                <TrendingDown size={24} className="mx-auto mb-2" />
                <p className="font-semibold">Eu Devo</p>
                <p className="text-xs mt-1 opacity-75">Dinheiro a pagar</p>
              </button>
            </div>
          </div>

          {/* Pessoa */}
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <User size={16} className="text-primary" />
              Pessoa *
            </label>
            <select
              name="person_id"
              value={formData.person_id}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                errors.person_id ? 'border-red-500' : 'border-dark-border'
              } text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
            >
              <option value="">Selecione uma pessoa</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
            {errors.person_id && <p className="text-red-500 text-sm mt-1">{errors.person_id}</p>}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              Descrição *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Empréstimo, Compra, etc."
              className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                errors.description ? 'border-red-500' : 'border-dark-border'
              } text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Valor e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-primary" />
                Valor Total *
              </label>
              <input
                type="number"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 bg-dark-bg border-2 ${
                  errors.total_amount ? 'border-red-500' : 'border-dark-border'
                } text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
              />
              {errors.total_amount && <p className="text-red-500 text-sm mt-1">{errors.total_amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                Data de Vencimento
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Observações
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Informações adicionais..."
              rows={3}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Preview do Valor */}
          {formData.total_amount && (
            <div className={`p-4 rounded-xl border-2 ${
              formData.type === 'owes_me'
                ? 'border-green-500/30 bg-green-500/10'
                : 'border-red-500/30 bg-red-500/10'
            }`}>
              <p className="text-sm text-dark-muted mb-1">
                {formData.type === 'owes_me' ? 'Você vai receber:' : 'Você deve pagar:'}
              </p>
              <p className={`text-3xl font-bold ${
                formData.type === 'owes_me' ? 'text-green-400' : 'text-red-400'
              }`}>
                R$ {parseFloat(formData.total_amount || 0).toFixed(2)}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-dark-border">
            <button
              type="submit"
              className={`flex-1 text-white py-3 px-6 rounded-lg transition-all font-semibold shadow-lg ${
                formData.type === 'owes_me'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
              }`}
            >
              {debt ? 'Atualizar' : 'Adicionar'} Dívida
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

export default DebtForm;
