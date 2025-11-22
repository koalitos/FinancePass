import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { AlertCircle, CheckCircle } from 'lucide-react';

const OverdueBills = () => {
  const [overdueBills, setOverdueBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverdueBills();
  }, []);

  const loadOverdueBills = async () => {
    try {
      const response = await api.get('/bills/payments/overdue');
      setOverdueBills(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar contas atrasadas:', error);
      setLoading(false);
    }
  };

  const markAsPaid = async (billId) => {
    const paidDate = prompt('Data do pagamento (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (!paidDate) return;

    const createExpense = window.confirm('Deseja criar uma despesa automaticamente?');

    try {
      await api.put(`/bills/payments/${billId}/pay`, {
        paid_date: paidDate,
        create_expense: createExpense,
        payment_method: 'bank_transfer'
      });
      alert('Conta marcada como paga!');
      loadOverdueBills();
    } catch (error) {
      console.error('Erro ao marcar conta como paga:', error);
      alert('Erro ao marcar conta como paga');
    }
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalOverdue = overdueBills.reduce((sum, bill) => sum + bill.amount, 0);

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle size={32} className="text-red-600" />
        <div>
          <h1 className="text-3xl font-bold">Contas Atrasadas</h1>
          <p className="text-gray-600">Total em atraso: R$ {totalOverdue.toFixed(2)}</p>
        </div>
      </div>

      {overdueBills.length === 0 ? (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-12 text-center shadow-xl">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={56} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-green-800 mb-3">
            🎉 Parabéns! Nenhuma conta atrasada
          </h2>
          <p className="text-green-700 text-lg">Todas as suas contas estão em dia. Continue assim!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {overdueBills.map((bill) => {
            const daysOverdue = getDaysOverdue(bill.due_date);
            return (
              <div
                key={bill.id}
                className="bg-dark-card border-l-8 border-red-600 rounded-xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-dark-border"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-md"
                          style={{ backgroundColor: bill.category_color || '#ef4444' }}
                        >
                          {bill.category_icon} {bill.category_name || 'Sem categoria'}
                        </span>
                        <span className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-bold animate-pulse">
                          ⚠️ {daysOverdue} {daysOverdue === 1 ? 'dia' : 'dias'} de atraso
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-dark-text">{bill.bill_name}</h3>
                      <div className="grid grid-cols-2 gap-6 bg-red-900/20 border border-red-500/30 p-5 rounded-xl">
                        <div>
                          <p className="text-xs text-dark-muted uppercase font-semibold mb-1">Vencimento</p>
                          <p className="font-bold text-lg text-dark-text">
                            {new Date(bill.due_date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-dark-muted uppercase font-semibold mb-1">Valor</p>
                          <p className="font-bold text-red-500 text-2xl">
                            R$ {bill.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      {bill.notes && (
                        <p className="text-sm text-dark-muted mt-4 bg-dark-bg border border-dark-border p-3 rounded-lg italic">
                          <strong>💬 Obs:</strong> {bill.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => markAsPaid(bill.id)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 ml-6 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                      ✅ Marcar como Paga
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OverdueBills;
