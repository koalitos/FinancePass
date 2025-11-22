import React, { useState, useEffect } from 'react';
import { getExpenses, deleteExpense } from '../../api/api';
import { Plus, Trash2, Edit } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const response = await getExpenses();
      const allExpenses = response.data;
      
      // Separar despesas normais e parcelas
      const normalExpenses = allExpenses.filter(exp => !exp.installment_id);
      const installmentExpenses = allExpenses.filter(exp => exp.installment_id);
      
      // Agrupar parcelas por installment_id
      const installmentGroups = {};
      installmentExpenses.forEach(exp => {
        if (!installmentGroups[exp.installment_id]) {
          installmentGroups[exp.installment_id] = [];
        }
        installmentGroups[exp.installment_id].push(exp);
      });
      
      // Criar entradas unificadas para compras parceladas
      const unifiedInstallments = Object.entries(installmentGroups).map(([installmentId, parcelas]) => {
        const firstParcela = parcelas[0];
        const totalAmount = parcelas.reduce((sum, p) => sum + p.amount, 0);
        const paidCount = parcelas.filter(p => new Date(p.date) <= new Date()).length;
        
        return {
          id: `installment-${installmentId}`,
          installment_id: parseInt(installmentId),
          description: firstParcela.description.replace(/\s*\(\d+\/\d+\)/, ''), // Remove (1/4) do nome
          date: firstParcela.date,
          category_name: firstParcela.category_name,
          category_color: firstParcela.category_color,
          category_icon: firstParcela.category_icon,
          person_name: firstParcela.person_name,
          amount: totalAmount,
          installment_count: parcelas.length,
          paid_count: paidCount,
          isInstallment: true
        };
      });
      
      // Combinar despesas normais com compras parceladas unificadas
      const combined = [...normalExpenses, ...unifiedInstallments];
      combined.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setExpenses(combined);
    } catch (error) {
      console.error('Erro ao carregar gastos:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este gasto?')) {
      try {
        await deleteExpense(id);
        loadExpenses();
      } catch (error) {
        console.error('Erro ao excluir gasto:', error);
      }
    }
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">💸 Gastos</h1>
          <p className="text-dark-muted mt-1">Total: R$ {total.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = '/expenses/installments/new'}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Compra Parcelada
          </button>
          <button
            onClick={() => {
              setEditingExpense(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Gasto
          </button>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4">Data</th>
                <th className="text-left py-3 px-4">Descrição</th>
                <th className="text-left py-3 px-4">Categoria</th>
                <th className="text-left py-3 px-4">Pessoa</th>
                <th className="text-right py-3 px-4">Valor</th>
                <th className="text-right py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className={`border-b border-dark-border hover:bg-dark-border/30 ${expense.isInstallment ? 'bg-purple-500/5' : ''}`}>
                  <td className="py-3 px-4">{new Date(expense.date).toLocaleDateString('pt-BR')}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {expense.isInstallment && (
                        <span className="text-purple-400 text-xs">💳</span>
                      )}
                      {expense.description}
                    </div>
                    {expense.isInstallment && (
                      <div className="text-xs text-dark-muted mt-1">
                        {expense.installment_count}x de R$ {(expense.amount / expense.installment_count).toFixed(2)} 
                        <span className="ml-2 text-purple-400">
                          ({expense.paid_count}/{expense.installment_count} pagas)
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {expense.category_name && (
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: expense.category_color + '20', color: expense.category_color }}>
                        {expense.category_icon} {expense.category_name}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">{expense.person_name || '-'}</td>
                  <td className="py-3 px-4 text-right font-semibold text-danger">
                    R$ {expense.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {!expense.isInstallment ? (
                      <>
                        <button
                          onClick={() => {
                            setEditingExpense(expense);
                            setShowForm(true);
                          }}
                          className="p-1 hover:bg-dark-border rounded mr-2"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-1 hover:bg-danger/20 text-danger rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => window.location.href = '/expenses/installments'}
                        className="text-xs text-purple-400 hover:text-purple-300 underline"
                      >
                        Ver detalhes
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onClose={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
          onSave={() => {
            setShowForm(false);
            setEditingExpense(null);
            loadExpenses();
          }}
        />
      )}
    </div>
  );
};

export default ExpenseList;
