import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Trash2, Eye, Calendar, DollarSign, Plus } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import api from '../../api/api';

const InstallmentList = () => {
  const navigate = useNavigate();
  const toast = useToastContext();
  const [installments, setInstallments] = useState([]);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [installmentToDelete, setInstallmentToDelete] = useState(null);

  const loadInstallments = useCallback(async () => {
    try {
      const response = await api.get('/installments');
      setInstallments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar compras parceladas:', error);
      toast.error('Erro ao carregar compras parceladas');
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadInstallments();
  }, [loadInstallments]);

  useEffect(() => {
    loadInstallments();
  }, [loadInstallments]);

  const loadInstallmentExpenses = async (id) => {
    try {
      const response = await api.get(`/installments/${id}/expenses`);
      setExpenses(response.data);
      setSelectedInstallment(selectedInstallment === id ? null : id);
    } catch (error) {
      console.error('Erro ao carregar parcelas:', error);
      toast.error('Erro ao carregar parcelas');
    }
  };

  const confirmDelete = (installment) => {
    setInstallmentToDelete(installment);
    setShowDeleteModal(true);
  };

  const deleteInstallment = async () => {
    if (!installmentToDelete) return;

    try {
      await api.delete(`/installments/${installmentToDelete.id}`);
      toast.success('Compra parcelada excluída com sucesso!');
      loadInstallments();
      if (selectedInstallment === installmentToDelete.id) {
        setSelectedInstallment(null);
        setExpenses([]);
      }
      setShowDeleteModal(false);
      setInstallmentToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir compra parcelada:', error);
      toast.error('Erro ao excluir compra parcelada');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-dark-border border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="text-primary" size={32} />
            Compras Parceladas
          </h1>
          <p className="text-dark-muted mt-1">Gerencie suas compras divididas em parcelas</p>
        </div>
        <button
          onClick={() => navigate('/expenses/installments/new')}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Nova Compra Parcelada
        </button>
      </div>

      {installments.length === 0 ? (
        <div className="card text-center py-12">
          <CreditCard size={64} className="text-dark-muted mx-auto mb-4" />
          <p className="text-dark-muted text-lg mb-4">Nenhuma compra parcelada cadastrada</p>
          <button
            onClick={() => navigate('/expenses/installments/new')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Criar Primeira Compra Parcelada
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {installments.map((installment) => (
            <div key={installment.id} className="card bg-dark-card border-l-4 border-purple-500">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <CreditCard size={20} className="text-purple-400" />
                    {installment.description}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-dark-bg p-3 rounded-lg">
                      <p className="text-xs text-dark-muted mb-1">Valor Total</p>
                      <p className="text-lg font-bold text-red-400">
                        R$ {installment.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-dark-bg p-3 rounded-lg">
                      <p className="text-xs text-dark-muted mb-1">Parcelas</p>
                      <p className="text-lg font-semibold text-purple-400">
                        {installment.installment_count}x
                      </p>
                      <p className="text-xs text-dark-muted">
                        R$ {installment.installment_value.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-dark-bg p-3 rounded-lg">
                      <p className="text-xs text-dark-muted mb-1">Categoria</p>
                      <p className="text-sm">
                        {installment.category_icon} {installment.category_name || 'Sem categoria'}
                      </p>
                    </div>
                    <div className="bg-dark-bg p-3 rounded-lg">
                      <p className="text-xs text-dark-muted mb-1">Período</p>
                      <p className="text-sm flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(installment.start_date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-dark-muted">
                        até {(() => {
                          const endDate = new Date(installment.start_date);
                          endDate.setMonth(endDate.getMonth() + installment.installment_count - 1);
                          return endDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
                        })()}
                      </p>
                    </div>
                  </div>

                  {installment.notes && (
                    <div className="bg-dark-bg p-3 rounded-lg mb-3">
                      <p className="text-sm text-dark-muted">
                        <strong>Observações:</strong> {installment.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-dark-muted">
                    <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                      {installment.paid_installments || 0}/{installment.installment_count} pagas
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => loadInstallmentExpenses(installment.id)}
                    className="bg-primary hover:bg-primary/80 text-white p-2 rounded-lg transition-all"
                    title="Ver Parcelas"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => confirmDelete(installment)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {selectedInstallment === installment.id && expenses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-dark-border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign size={18} className="text-primary" />
                    Parcelas Detalhadas
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-dark-bg">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted">Parcela</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted">Data</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted">Valor</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border">
                        {expenses.map((expense, index) => {
                          const isPast = new Date(expense.date) <= new Date();
                          return (
                            <tr key={expense.id} className="hover:bg-dark-bg/50">
                              <td className="px-4 py-3 text-sm font-semibold">
                                {index + 1}/{installment.installment_count}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {new Date(expense.date).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-purple-400">
                                R$ {expense.amount.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  isPast
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {isPast ? '✓ Vencida' : '⏳ Pendente'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && installmentToDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-card rounded-xl shadow-2xl max-w-md w-full border border-dark-border">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 rounded-t-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Trash2 size={24} />
                Confirmar Exclusão
              </h3>
            </div>
            <div className="p-6">
              <p className="text-dark-text mb-4">
                Tem certeza que deseja excluir a compra parcelada <strong>"{installmentToDelete.description}"</strong>?
              </p>
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-300">
                  ⚠️ <strong>Atenção:</strong> Todas as {installmentToDelete.installment_count} parcelas serão removidas permanentemente!
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={deleteInstallment}
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-6 rounded-lg hover:from-red-700 hover:to-rose-700 transition-all font-semibold"
                >
                  Sim, Excluir
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setInstallmentToDelete(null);
                  }}
                  className="flex-1 bg-dark-border text-dark-text py-3 px-6 rounded-lg hover:bg-dark-border/70 transition-all font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstallmentList;
