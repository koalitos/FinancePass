import React, { useState, useEffect } from 'react';
import { getIncomes, deleteIncome, createIncome, updateIncome } from '../../api/api';
import { Plus, Trash2, Edit } from 'lucide-react';
import IncomeForm from './IncomeForm';

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    try {
      const response = await getIncomes();
      setIncomes(response.data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja excluir esta receita?')) {
      try {
        await deleteIncome(id);
        loadIncomes();
      } catch (error) {
        alert('Erro ao excluir receita');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingIncome) {
        await updateIncome(editingIncome.id, data);
      } else {
        await createIncome(data);
      }
      setShowForm(false);
      setEditingIncome(null);
      loadIncomes();
    } catch (error) {
      alert('Erro ao salvar receita');
    }
  };

  const handleEdit = (income) => {
    setEditingIncome(income);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingIncome(null);
  };

  const total = incomes.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">💰 Receitas</h1>
          <p className="text-dark-muted mt-1">Total: R$ {total.toFixed(2)}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nova Receita
        </button>
      </div>

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-3 px-4">Data</th>
              <th className="text-left py-3 px-4">Descrição</th>
              <th className="text-left py-3 px-4">Fonte</th>
              <th className="text-right py-3 px-4">Valor</th>
              <th className="text-right py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income) => (
              <tr key={income.id} className="border-b border-dark-border hover:bg-dark-bg">
                <td className="py-3 px-4">{new Date(income.date).toLocaleDateString('pt-BR')}</td>
                <td className="py-3 px-4">{income.description}</td>
                <td className="py-3 px-4">{income.source}</td>
                <td className="py-3 px-4 text-right font-semibold text-success">
                  R$ {income.amount.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleEdit(income)}
                      className="p-1 hover:bg-primary/20 text-primary rounded"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(income.id)}
                      className="p-1 hover:bg-danger/20 text-danger rounded"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {incomes.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-dark-muted">
                  Nenhuma receita cadastrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <IncomeForm
          onClose={handleCloseForm}
          onSave={handleSave}
          income={editingIncome}
        />
      )}
    </div>
  );
};

export default IncomeList;
