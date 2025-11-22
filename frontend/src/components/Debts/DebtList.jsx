import React, { useState, useEffect } from 'react';
import { getDebts, createDebt, addDebtPayment } from '../../api/api';
import { Plus, DollarSign } from 'lucide-react';
import DebtForm from './DebtForm';
import PaymentForm from './PaymentForm';

const DebtList = () => {
  const [debts, setDebts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const response = await getDebts();
      setDebts(response.data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSave = async (data) => {
    try {
      await createDebt(data);
      setShowForm(false);
      loadDebts();
    } catch (error) {
      alert('Erro ao salvar dívida');
    }
  };

  const handlePayment = async (data) => {
    try {
      await addDebtPayment(selectedDebt.id, data);
      setShowPaymentForm(false);
      setSelectedDebt(null);
      loadDebts();
    } catch (error) {
      alert('Erro ao registrar pagamento');
    }
  };

  const openPaymentForm = (debt) => {
    setSelectedDebt(debt);
    setShowPaymentForm(true);
  };

  const owesMe = debts.filter(d => d.type === 'owes_me');
  const iOwe = debts.filter(d => d.type === 'i_owe');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">💳 Dívidas</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nova Dívida
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-success">Me Devem</h2>
          <div className="space-y-3">
            {owesMe.map((debt) => {
              const remaining = debt.total_amount - debt.paid_amount;
              const isPaid = remaining <= 0;
              return (
                <div key={debt.id} className={`p-3 bg-dark-bg rounded-lg ${isPaid ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold">{debt.person_name}</p>
                      <p className="text-sm text-dark-muted">{debt.description}</p>
                      {debt.due_date && (
                        <p className="text-xs text-dark-muted mt-1">
                          Vencimento: {new Date(debt.due_date).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${isPaid ? 'text-dark-muted line-through' : 'text-success'}`}>
                        R$ {remaining.toFixed(2)}
                      </p>
                      {!isPaid && (
                        <button
                          onClick={() => openPaymentForm(debt)}
                          className="mt-1 text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <DollarSign size={12} />
                          Receber
                        </button>
                      )}
                    </div>
                  </div>
                  {debt.paid_amount > 0 && (
                    <div className="mt-2 pt-2 border-t border-dark-border">
                      <div className="flex justify-between text-xs text-dark-muted">
                        <span>Pago: R$ {debt.paid_amount.toFixed(2)}</span>
                        <span>Total: R$ {debt.total_amount.toFixed(2)}</span>
                      </div>
                      <div className="mt-1 bg-dark-border rounded-full h-1.5">
                        <div
                          className="bg-success rounded-full h-1.5"
                          style={{ width: `${(debt.paid_amount / debt.total_amount) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {isPaid && (
                    <div className="mt-2 text-xs text-success font-semibold">✓ Pago</div>
                  )}
                </div>
              );
            })}
            {owesMe.length === 0 && (
              <p className="text-dark-muted text-center py-4">Nenhuma dívida a receber</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-danger">Eu Devo</h2>
          <div className="space-y-3">
            {iOwe.map((debt) => {
              const remaining = debt.total_amount - debt.paid_amount;
              const isPaid = remaining <= 0;
              return (
                <div key={debt.id} className={`p-3 bg-dark-bg rounded-lg ${isPaid ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold">{debt.person_name}</p>
                      <p className="text-sm text-dark-muted">{debt.description}</p>
                      {debt.due_date && (
                        <p className="text-xs text-dark-muted mt-1">
                          Vencimento: {new Date(debt.due_date).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${isPaid ? 'text-dark-muted line-through' : 'text-danger'}`}>
                        R$ {remaining.toFixed(2)}
                      </p>
                      {!isPaid && (
                        <button
                          onClick={() => openPaymentForm(debt)}
                          className="mt-1 text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <DollarSign size={12} />
                          Pagar
                        </button>
                      )}
                    </div>
                  </div>
                  {debt.paid_amount > 0 && (
                    <div className="mt-2 pt-2 border-t border-dark-border">
                      <div className="flex justify-between text-xs text-dark-muted">
                        <span>Pago: R$ {debt.paid_amount.toFixed(2)}</span>
                        <span>Total: R$ {debt.total_amount.toFixed(2)}</span>
                      </div>
                      <div className="mt-1 bg-dark-border rounded-full h-1.5">
                        <div
                          className="bg-danger rounded-full h-1.5"
                          style={{ width: `${(debt.paid_amount / debt.total_amount) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {isPaid && (
                    <div className="mt-2 text-xs text-success font-semibold">✓ Pago</div>
                  )}
                </div>
              );
            })}
            {iOwe.length === 0 && (
              <p className="text-dark-muted text-center py-4">Nenhuma dívida a pagar</p>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <DebtForm
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      {showPaymentForm && selectedDebt && (
        <PaymentForm
          onClose={() => {
            setShowPaymentForm(false);
            setSelectedDebt(null);
          }}
          onSave={handlePayment}
          debt={selectedDebt}
        />
      )}
    </div>
  );
};

export default DebtList;
