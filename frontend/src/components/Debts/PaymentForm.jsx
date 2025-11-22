import React, { useState } from 'react';
import { X, DollarSign, Calendar } from 'lucide-react';

const PaymentForm = ({ onClose, onSave, debt }) => {
  const remaining = debt.total_amount - debt.paid_amount;
  const [formData, setFormData] = useState({
    amount: remaining.toFixed(2),
    payment_date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    
    if (amount <= 0) {
      setError('Valor deve ser maior que zero');
      return;
    }
    
    if (amount > remaining) {
      setError(`Valor não pode ser maior que R$ ${remaining.toFixed(2)}`);
      return;
    }

    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const isReceiving = debt.type === 'owes_me';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-xl shadow-2xl max-w-md w-full border border-dark-border">
        {/* Header */}
        <div className={`p-6 rounded-t-xl ${
          isReceiving
            ? 'bg-gradient-to-r from-green-600 to-emerald-600'
            : 'bg-gradient-to-r from-red-600 to-rose-600'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <DollarSign size={24} />
                {isReceiving ? 'Registrar Recebimento' : 'Registrar Pagamento'}
              </h2>
              <p className="text-white/90 text-sm mt-1">{debt.person_name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Info da Dívida */}
          <div className="bg-dark-bg rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-muted">Descrição:</span>
              <span className="font-semibold">{debt.description}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-muted">Valor Total:</span>
              <span className="font-semibold">R$ {debt.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-muted">Já Pago:</span>
              <span className="font-semibold">R$ {debt.paid_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-dark-border">
              <span className="text-dark-muted">Restante:</span>
              <span className={`font-bold text-lg ${isReceiving ? 'text-green-400' : 'text-red-400'}`}>
                R$ {remaining.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Valor do Pagamento */}
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <DollarSign size={16} className="text-primary" />
              Valor {isReceiving ? 'Recebido' : 'Pago'}
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              max={remaining}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg font-semibold"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            
            {/* Quick Amount Buttons */}
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, amount: (remaining / 2).toFixed(2) }))}
                className="flex-1 py-2 px-3 bg-dark-bg border border-dark-border rounded-lg text-sm hover:border-primary transition-all"
              >
                Metade
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, amount: remaining.toFixed(2) }))}
                className="flex-1 py-2 px-3 bg-dark-bg border border-dark-border rounded-lg text-sm hover:border-primary transition-all"
              >
                Total
              </button>
            </div>
          </div>

          {/* Data do Pagamento */}
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              Data do {isReceiving ? 'Recebimento' : 'Pagamento'}
            </label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-dark-border">
            <button
              type="submit"
              className={`flex-1 text-white py-3 px-6 rounded-lg transition-all font-semibold shadow-lg ${
                isReceiving
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
              }`}
            >
              Confirmar {isReceiving ? 'Recebimento' : 'Pagamento'}
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

export default PaymentForm;
