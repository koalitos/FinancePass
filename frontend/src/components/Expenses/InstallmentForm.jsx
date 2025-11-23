import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '../../contexts/ToastContext';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import api from '../../api/api';

const InstallmentForm = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate();
  
  // Fechar/voltar com ESC
  useEscapeKey(() => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/expenses/installments');
    }
  });
  const toast = useToastContext();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    total_amount: '',
    installment_count: '',
    category_id: '',
    payment_method: 'credit_card',
    start_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

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
    
    // Validações
    if (!formData.description.trim()) {
      toast.error('Descrição é obrigatória');
      return;
    }
    
    if (!formData.total_amount || parseFloat(formData.total_amount) <= 0) {
      toast.error('Valor total deve ser maior que zero');
      return;
    }
    
    if (!formData.installment_count || parseInt(formData.installment_count) < 2) {
      toast.error('Número de parcelas deve ser no mínimo 2');
      return;
    }
    
    try {
      const response = await api.post('/installments', {
        ...formData,
        total_amount: parseFloat(formData.total_amount),
        installment_count: parseInt(formData.installment_count)
      });
      
      console.log('Resposta do servidor:', response);
      toast.success('Compra parcelada criada com sucesso!');
      
      // Navegar de volta para a lista de parcelamentos
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/expenses/installments');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      console.error('Resposta do erro:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao criar compra parcelada';
      toast.error(errorMessage);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const installmentValue = formData.total_amount && formData.installment_count
    ? (parseFloat(formData.total_amount) / parseInt(formData.installment_count)).toFixed(2)
    : '0.00';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-xl p-6 text-white">
        <h2 className="text-3xl font-bold">💳 Nova Compra Parcelada</h2>
        <p className="text-purple-100 mt-2">Divida suas compras em parcelas mensais</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-dark-card rounded-b-xl shadow-xl p-8 space-y-6 border border-dark-border">
        <div>
          <label className="block text-sm font-semibold text-dark-text mb-2">
            📝 Descrição *
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            placeholder="Ex: Notebook Dell Inspiron 15"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-dark-text mb-2">
              💰 Valor Total *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-dark-muted font-semibold">R$</span>
              <input
                type="number"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full pl-12 pr-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                placeholder="0,00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-text mb-2">
              🔢 Número de Parcelas *
            </label>
            <input
              type="number"
              name="installment_count"
              value={formData.installment_count}
              onChange={handleChange}
              required
              min="2"
              max="48"
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="12"
            />
          </div>
        </div>

        {formData.total_amount && formData.installment_count && (
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-500/50 p-5 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-muted mb-1">Valor de cada parcela</p>
                <p className="text-3xl font-bold text-purple-400">R$ {installmentValue}</p>
              </div>
              <div className="text-5xl">💳</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-dark-text mb-2">
              🏷️ Categoria
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
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
            <label className="block text-sm font-semibold text-dark-text mb-2">
              💳 Método de Pagamento
            </label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            >
              <option value="credit_card">💳 Cartão de Crédito</option>
              <option value="debit_card">💳 Cartão de Débito</option>
              <option value="bank_slip">📄 Boleto</option>
              <option value="pix">⚡ PIX</option>
              <option value="cash">💵 Dinheiro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark-text mb-2">
            📅 Data da Primeira Parcela *
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark-text mb-2">
            📋 Observações
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
            placeholder="Informações adicionais sobre a compra..."
          />
        </div>

        <div className="flex gap-3 pt-4 border-t-2 border-dark-border">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            ✨ Criar Compra Parcelada
          </button>
          <button
            type="button"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                navigate('/expenses/installments');
              }
            }}
            className="flex-1 bg-dark-border text-dark-text py-4 px-6 rounded-xl hover:bg-dark-border/70 transition-all font-semibold text-lg"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstallmentForm;
