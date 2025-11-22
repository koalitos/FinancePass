import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { Plus, Trash2, Edit, Calendar } from 'lucide-react';

const RecurringBills = () => {
  const [bills, setBills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    category_id: '',
    due_day: '',
    is_active: true,
    auto_create: true,
    notes: ''
  });

  useEffect(() => {
    loadBills();
    loadCategories();
  }, []);

  const loadBills = async () => {
    try {
      const response = await api.get('/bills/recurring');
      setBills(response.data);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories?type=expense');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBill) {
        await api.put(`/bills/recurring/${editingBill.id}`, {
          ...formData,
          amount: parseFloat(formData.amount),
          due_day: parseInt(formData.due_day)
        });
        alert('Conta atualizada com sucesso!');
      } else {
        await api.post('/bills/recurring', {
          ...formData,
          amount: parseFloat(formData.amount),
          due_day: parseInt(formData.due_day)
        });
        alert('Conta criada com sucesso!');
      }
      setShowForm(false);
      setEditingBill(null);
      resetForm();
      loadBills();
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      alert('Erro ao salvar conta');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir esta conta?')) return;
    
    try {
      await api.delete(`/bills/recurring/${id}`);
      alert('Conta excluída com sucesso!');
      loadBills();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta');
    }
  };

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setFormData({
      name: bill.name,
      description: bill.description || '',
      amount: bill.amount,
      category_id: bill.category_id || '',
      due_day: bill.due_day,
      is_active: bill.is_active,
      auto_create: bill.auto_create,
      notes: bill.notes || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      amount: '',
      category_id: '',
      due_day: '',
      is_active: true,
      auto_create: true,
      notes: ''
    });
  };

  const generatePayments = async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    try {
      const response = await api.post(`/bills/payments/generate/${year}/${month}`);
      alert(`${response.data.created} pagamentos gerados para este mês!`);
    } catch (error) {
      console.error('Erro ao gerar pagamentos:', error);
      alert('Erro ao gerar pagamentos');
    }
  };

  const totalMonthly = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">💡 Contas Mensais</h1>
          <p className="text-gray-600 mt-1">Total mensal: R$ {totalMonthly.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generatePayments}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
          >
            <Calendar size={20} />
            Gerar Pagamentos do Mês
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingBill(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Nova Conta
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-t-xl p-6 text-white">
            <h2 className="text-2xl font-bold">
              {editingBill ? '✏️ Editar Conta' : '💡 Nova Conta Mensal'}
            </h2>
            <p className="text-green-100 mt-1">
              {editingBill ? 'Atualize as informações da conta' : 'Cadastre contas fixas como luz, água, internet'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="bg-dark-card rounded-b-xl shadow-xl p-8 space-y-6 border border-dark-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark-text mb-2">💡 Nome da Conta *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Ex: Conta de Luz"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-text mb-2">💰 Valor Mensal *</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-dark-muted font-semibold">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="0,00"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark-text mb-2">🏷️ Categoria</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark-text mb-2">📅 Dia do Vencimento *</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.due_day}
                  onChange={(e) => setFormData({ ...formData, due_day: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Dia 1 a 31"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark-text mb-2">📝 Descrição</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Informações adicionais sobre a conta"
              />
            </div>

            <div className="bg-dark-bg border border-dark-border p-4 rounded-lg space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-dark-text">✅ Conta ativa</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.auto_create}
                  onChange={(e) => setFormData({ ...formData, auto_create: e.target.checked })}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-dark-text">🔄 Criar pagamentos automaticamente todo mês</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4 border-t-2 border-dark-border">
              <button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {editingBill ? '✅ Atualizar Conta' : '✨ Criar Conta'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBill(null);
                  resetForm();
                }}
                className="flex-1 bg-dark-border text-dark-text py-4 px-6 rounded-xl hover:bg-dark-border/70 transition-all font-semibold text-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {bills.map((bill) => (
          <div key={bill.id} className="bg-dark-card rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 overflow-hidden border border-dark-border" style={{ borderLeftColor: bill.category_color || '#10b981' }}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {bill.category_icon && (
                      <span
                        className="px-3 py-1.5 rounded-lg text-white text-sm font-semibold shadow-md"
                        style={{ backgroundColor: bill.category_color || '#6b7280' }}
                      >
                        {bill.category_icon} {bill.category_name}
                      </span>
                    )}
                    {!bill.is_active && (
                      <span className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                        ⏸️ Inativa
                      </span>
                    )}
                    {bill.auto_create && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                        🔄 Auto
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-dark-text">{bill.name}</h3>
                  {bill.description && (
                    <p className="text-dark-muted text-sm mb-4 italic">{bill.description}</p>
                  )}
                  <div className="grid grid-cols-2 gap-6 bg-dark-bg border border-dark-border p-4 rounded-lg">
                    <div>
                      <p className="text-xs text-dark-muted uppercase font-semibold mb-1">Valor Mensal</p>
                      <p className="text-2xl font-bold text-red-500">R$ {bill.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-muted uppercase font-semibold mb-1">Vencimento</p>
                      <p className="text-2xl font-bold text-dark-text">Dia {bill.due_day}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(bill)}
                    className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    title="Editar"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(bill.id)}
                    className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                    title="Excluir"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecurringBills;
