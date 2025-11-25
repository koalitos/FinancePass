import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import api from '../../api/api';
import { useToastContext } from '../../contexts/ToastContext';
import Modal from '../Common/Modal';

const GoalManager = () => {
  const toast = useToastContext();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(null);
  const [progressAmount, setProgressAmount] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_amount: '',
    current_amount: '0',
    deadline: '',
    category: 'savings'
  });

  const categories = [
    { value: 'savings', label: 'Poupança', icon: '💰' },
    { value: 'emergency', label: 'Emergência', icon: '🚨' },
    { value: 'travel', label: 'Viagem', icon: '✈️' },
    { value: 'purchase', label: 'Compra', icon: '🛍️' },
    { value: 'investment', label: 'Investimento', icon: '📈' },
    { value: 'education', label: 'Educação', icon: '📚' },
    { value: 'house', label: 'Casa', icon: '🏠' },
    { value: 'car', label: 'Carro', icon: '🚗' },
    { value: 'other', label: 'Outro', icon: '🎯' }
  ];

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const response = await api.get('/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Preparar dados para envio
      const dataToSend = {
        ...formData,
        deadline: formData.deadline || null,
        description: formData.description || null
      };

      if (editingGoal) {
        await api.put(`/goals/${editingGoal.id}`, dataToSend);
        toast.success('Meta atualizada!');
      } else {
        await api.post('/goals', dataToSend);
        toast.success('Meta criada!');
      }

      setShowForm(false);
      setEditingGoal(null);
      setFormData({
        name: '',
        description: '',
        target_amount: '',
        current_amount: '0',
        deadline: '',
        category: 'savings'
      });
      loadGoals();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      toast.error(error.response?.data?.error || 'Erro ao salvar meta');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir esta meta?')) return;

    try {
      await api.delete(`/goals/${id}`);
      toast.success('Meta excluída!');
      loadGoals();
    } catch (error) {
      toast.error('Erro ao excluir meta');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || '',
      target_amount: goal.target_amount,
      current_amount: goal.current_amount,
      deadline: goal.deadline || '',
      category: goal.category,
      status: goal.status
    });
    setShowForm(true);
  };

  const handleAddProgress = async (goalId) => {
    if (!progressAmount || parseFloat(progressAmount) <= 0) {
      toast.error('Digite um valor válido');
      return;
    }

    try {
      await api.put(`/goals/${goalId}/progress`, { amount: parseFloat(progressAmount) });
      toast.success('Progresso atualizado!');
      setShowProgressModal(null);
      setProgressAmount('');
      loadGoals();
    } catch (error) {
      toast.error('Erro ao atualizar progresso');
    }
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : '🎯';
  };

  const getStatusColor = (goal) => {
    if (goal.status === 'completed') return 'border-success bg-success/10';
    if (goal.progress >= 75) return 'border-primary bg-primary/10';
    if (goal.progress >= 50) return 'border-warning bg-warning/10';
    return 'border-dark-border bg-dark-card';
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-success';
    if (progress >= 75) return 'bg-primary';
    if (progress >= 50) return 'bg-warning';
    return 'bg-danger';
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🎯 Metas Financeiras</h1>
            <p className="text-dark-muted text-sm">Defina e acompanhe seus objetivos</p>
          </div>
          <button
            onClick={() => {
              setEditingGoal(null);
              setFormData({
                name: '',
                description: '',
                target_amount: '',
                current_amount: '0',
                deadline: '',
                category: 'savings'
              });
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Nova Meta
          </button>
        </div>
      </div>

      <div className="page-content space-y-4">
        {/* Resumo */}
        <div className="grid-compact grid-cols-1 md:grid-cols-3">
          <div className="card-compact">
            <p className="text-dark-muted text-xs mb-1">Metas Ativas</p>
            <p className="text-xl font-bold text-primary">{activeGoals.length}</p>
          </div>
          <div className="card-compact">
            <p className="text-dark-muted text-xs mb-1">Metas Concluídas</p>
            <p className="text-xl font-bold text-success">{completedGoals.length}</p>
          </div>
          <div className="card-compact">
            <p className="text-dark-muted text-xs mb-1">Total em Metas</p>
            <p className="text-xl font-bold text-warning">
              R$ {activeGoals.reduce((sum, g) => sum + g.current_amount, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Metas Ativas */}
        {activeGoals.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Metas Ativas</h2>
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(goal)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                      <div>
                        <h3 className="font-semibold">{goal.name}</h3>
                        {goal.description && (
                          <p className="text-sm text-dark-muted">{goal.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowProgressModal(goal)}
                        className="p-1 hover:bg-primary/20 text-primary rounded"
                        title="Adicionar progresso"
                      >
                        <TrendingUp size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-1 hover:bg-dark-border rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-1 hover:bg-danger/20 text-danger rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-muted">Progresso:</span>
                      <span className="font-semibold">
                        R$ {goal.current_amount.toFixed(2)} / R$ {goal.target_amount.toFixed(2)}
                      </span>
                    </div>

                    {goal.deadline && (
                      <div className="flex justify-between text-sm">
                        <span className="text-dark-muted flex items-center gap-1">
                          <Calendar size={14} />
                          Prazo:
                        </span>
                        <span className={`font-semibold ${goal.daysRemaining < 30 ? 'text-danger' : ''}`}>
                          {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                          {goal.daysRemaining !== null && (
                            <span className="ml-2 text-xs">
                              ({goal.daysRemaining > 0 ? `${goal.daysRemaining} dias` : 'Vencido'})
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-dark-muted">Faltam:</span>
                      <span className="font-semibold text-warning">
                        R$ {goal.remaining.toFixed(2)}
                      </span>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="mt-3">
                      <div className="w-full bg-dark-border rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${getProgressColor(goal.progress)}`}
                          style={{ width: `${Math.min(goal.progress, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-dark-muted mt-1 text-right">
                        {goal.progress.toFixed(1)}% concluído
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metas Concluídas */}
        {completedGoals.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="text-success" size={20} />
              Metas Concluídas
            </h2>
            <div className="space-y-3">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-3 rounded-lg bg-success/10 border border-success"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryIcon(goal.category)}</span>
                      <div>
                        <h3 className="font-semibold">{goal.name}</h3>
                        <p className="text-sm text-success">
                          ✓ Meta atingida: R$ {goal.target_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-1 hover:bg-danger/20 text-danger rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {goals.length === 0 && (
          <div className="card text-center py-12">
            <Target className="mx-auto text-dark-muted mb-4" size={48} />
            <p className="text-dark-muted">Nenhuma meta cadastrada</p>
            <p className="text-sm text-dark-muted mt-2">
              Crie sua primeira meta financeira para começar!
            </p>
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingGoal(null);
        }}
        title={editingGoal ? 'Editar Meta' : 'Nova Meta'}
        subtitle="Defina seus objetivos financeiros"
        icon="🎯"
        gradient="from-warning to-orange-600"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome da Meta</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Ex: Viagem para Europa"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descrição (opcional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows="2"
                  placeholder="Detalhes sobre a meta..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Valor Alvo</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    className="input"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Valor Atual</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                    className="input"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Prazo (opcional)</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="input"
                />
              </div>

              {editingGoal && (
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input"
                  >
                    <option value="active">Ativa</option>
                    <option value="completed">Concluída</option>
                  </select>
                </div>
              )}

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingGoal(null);
              }}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {editingGoal ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Adicionar Progresso */}
      <Modal
        isOpen={showProgressModal !== null}
        onClose={() => {
          setShowProgressModal(null);
          setProgressAmount('');
        }}
        title="Adicionar Progresso"
        subtitle={showProgressModal ? `Meta: ${showProgressModal.name}` : ''}
        icon="📈"
        gradient="from-success to-green-600"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Valor a Adicionar</label>
            <input
              type="number"
              step="0.01"
              value={progressAmount}
              onChange={(e) => setProgressAmount(e.target.value)}
              className="input"
              placeholder="0.00"
              autoFocus
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setShowProgressModal(null);
                setProgressAmount('');
              }}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={() => showProgressModal && handleAddProgress(showProgressModal.id)}
              className="btn-primary"
            >
              Adicionar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GoalManager;
