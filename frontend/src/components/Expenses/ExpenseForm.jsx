import React, { useState, useEffect } from 'react';
import { createExpense, updateExpense, getCategories, getPeople } from '../../api/api';
import { X } from 'lucide-react';

const ExpenseForm = ({ expense, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: '',
    payment_method: 'Dinheiro',
    date: new Date().toISOString().split('T')[0],
    person_id: '',
    is_paid_back: false,
    notes: '',
  });
  const [categories, setCategories] = useState([]);
  const [people, setPeople] = useState([]);

  useEffect(() => {
    loadCategories();
    loadPeople();
    if (expense) {
      setFormData({
        ...expense,
        is_paid_back: expense.is_paid_back === 1,
      });
    }
  }, [expense]);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.filter(c => c.type === 'expense'));
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadPeople = async () => {
    try {
      const response = await getPeople();
      setPeople(response.data);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, is_paid_back: formData.is_paid_back ? 1 : 0 };
      if (expense) {
        await updateExpense(expense.id, data);
      } else {
        await createExpense(data);
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar gasto:', error);
      alert('Erro ao salvar gasto');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-t-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">{expense ? '✏️ Editar Gasto' : '💸 Novo Gasto'}</h2>
              <p className="text-red-100 mt-1">Registre suas despesas</p>
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
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              placeholder="Ex: Almoço no restaurante"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">💰 Valor *</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-dark-muted font-semibold">R$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">📅 Data *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">🏷️ Categoria</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">💳 Método de Pagamento</label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              >
                <option>💵 Dinheiro</option>
                <option>💳 Cartão de Crédito</option>
                <option>💳 Cartão de Débito</option>
                <option>⚡ PIX</option>
                <option>🏦 Transferência</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-text mb-2">👤 Pessoa</label>
            <select
              value={formData.person_id}
              onChange={(e) => setFormData({ ...formData, person_id: e.target.value })}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            >
              <option value="">Nenhuma pessoa associada</option>
              {people.map(person => (
                <option key={person.id} value={person.id}>{person.name}</option>
              ))}
            </select>
          </div>

          {formData.person_id && (
            <div className="bg-dark-bg border border-dark-border p-4 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="is_paid_back"
                  checked={formData.is_paid_back}
                  onChange={(e) => setFormData({ ...formData, is_paid_back: e.target.checked })}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-dark-text">✅ Já foi pago de volta</span>
              </label>
            </div>
          )}

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
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6 rounded-xl hover:from-red-700 hover:to-orange-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {expense ? '✅ Atualizar' : '✨ Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
