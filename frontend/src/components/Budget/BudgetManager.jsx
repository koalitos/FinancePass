import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../../api/api';
import { useToastContext } from '../../contexts/ToastContext';
import Modal from '../Common/Modal';

const BudgetManager = () => {
  const toast = useToastContext();
  const [analysis, setAnalysis] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: ''
  });

  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadBudgets = async () => {
    try {
      const response = await api.get(`/budgets/${selectedYear}/${selectedMonth}`);
      // setBudgets is not needed as we use analysis data
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
    }
  };

  const loadAnalysis = async () => {
    try {
      const response = await api.get(`/budgets/analysis/${selectedYear}/${selectedMonth}`);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Erro ao carregar análise:', error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadBudgets();
    loadAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        year: selectedYear,
        month: selectedMonth
      };

      if (editingBudget) {
        await api.put(`/budgets/${editingBudget.id}`, { amount: formData.amount });
        toast.success('Orçamento atualizado!');
      } else {
        await api.post('/budgets', data);
        toast.success('Orçamento criado!');
      }

      setShowForm(false);
      setEditingBudget(null);
      setFormData({ category_id: '', amount: '' });
      loadBudgets();
      loadAnalysis();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar orçamento');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir este orçamento?')) return;

    try {
      await api.delete(`/budgets/${id}`);
      toast.success('Orçamento excluído!');
      loadBudgets();
      loadAnalysis();
    } catch (error) {
      toast.error('Erro ao excluir orçamento');
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category_id: budget.category_id,
      amount: budget.amount
    });
    setShowForm(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'exceeded':
        return <AlertTriangle className="text-danger" size={20} />;
      case 'warning':
        return <TrendingUp className="text-warning" size={20} />;
      default:
        return <CheckCircle className="text-success" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'exceeded':
        return 'bg-danger/20 border-danger';
      case 'warning':
        return 'bg-warning/20 border-warning';
      default:
        return 'bg-success/20 border-success';
    }
  };

  const totalBudget = analysis.reduce((sum, item) => sum + item.budget_amount, 0);
  const totalSpent = analysis.reduce((sum, item) => sum + item.spent_amount, 0);
  const totalRemaining = totalBudget - totalSpent;
  const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">💰 Orçamento</h1>
            <p className="text-dark-muted text-sm">Controle seus gastos por categoria</p>
          </div>
          <button
            onClick={() => {
              setEditingBudget(null);
              setFormData({ category_id: '', amount: '' });
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Novo Orçamento
          </button>
        </div>
      </div>

      <div className="page-content space-y-4">
        {/* Seletor de Mês */}
        <div className="card-compact">
          <div className="flex gap-4 items-center">
            <div>
              <label className="text-sm text-dark-muted">Mês</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="input mt-1"
              >
                {monthNames.map((name, index) => (
                  <option key={index} value={index + 1}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-dark-muted">Ano</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="input mt-1"
              >
                {[2024, 2025, 2026].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resumo Geral */}
        <div className="grid-compact grid-cols-1 md:grid-cols-4">
          <div className="card-compact">
            <p className="text-dark-muted text-xs mb-1">Orçamento Total</p>
            <p className="text-xl font-bold text-primary">R$ {totalBudget.toFixed(2)}</p>
          </div>
          <div className="card-compact">
            <p className="text-dark-muted text-xs mb-1">Total Gasto</p>
            <p className="text-xl font-bold text-danger">R$ {totalSpent.toFixed(2)}</p>
          </div>
          <div className="card-compact">
            <p className="text-dark-muted text-xs mb-1">Restante</p>
            <p className={`text-xl font-bold ${totalRemaining >= 0 ? 'text-success' : 'text-danger'}`}>
              R$ {totalRemaining.toFixed(2)}
            </p>
          </div>
          <div className="card-compact">
            <p className="text-dark-muted text-xs mb-1">% Utilizado</p>
            <p className={`text-xl font-bold ${totalPercentage > 100 ? 'text-danger' : totalPercentage > 90 ? 'text-warning' : 'text-success'}`}>
              {totalPercentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Análise por Categoria */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Análise por Categoria</h2>
          
          {analysis.length === 0 ? (
            <p className="text-center text-dark-muted py-8">
              Nenhum orçamento definido para este mês
            </p>
          ) : (
            <div className="space-y-4">
              {analysis.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-l-4 ${getStatusColor(item.status)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <div>
                        <span
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: item.category_color + '20',
                            color: item.category_color
                          }}
                        >
                          {item.category_icon} {item.category_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 hover:bg-dark-border rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 hover:bg-danger/20 text-danger rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-muted">Orçamento:</span>
                      <span className="font-semibold">R$ {item.budget_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-muted">Gasto:</span>
                      <span className="font-semibold text-danger">R$ {item.spent_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-muted">Restante:</span>
                      <span className={`font-semibold ${item.remaining >= 0 ? 'text-success' : 'text-danger'}`}>
                        R$ {item.remaining.toFixed(2)}
                      </span>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="mt-2">
                      <div className="w-full bg-dark-border rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            item.percentage > 100 ? 'bg-danger' :
                            item.percentage > 90 ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-dark-muted mt-1 text-right">
                        {item.percentage.toFixed(1)}% utilizado
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? 'Editar Orçamento' : 'Novo Orçamento'}
        subtitle="Defina limites de gastos por categoria"
        icon="💰"
        gradient="from-primary to-blue-600"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
              {!editingBudget && (
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Valor do Orçamento</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input"
                  placeholder="0.00"
                  required
                />
              </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingBudget(null);
              }}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {editingBudget ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BudgetManager;
