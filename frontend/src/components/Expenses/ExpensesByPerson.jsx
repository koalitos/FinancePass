import React, { useState, useEffect, useCallback } from 'react';
import { Users, DollarSign, Calendar, CheckCircle, XCircle, TrendingUp, FileText } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import api from '../../api/api';

const ExpensesByPerson = () => {
  const toast = useToastContext();
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Mês atual como padrão
  const currentDate = new Date();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [availableMonths, setAvailableMonths] = useState([]);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const loadPeopleWithExpenses = useCallback(async () => {
    try {
      const [peopleRes, expensesRes] = await Promise.all([
        api.get('/people'),
        api.get('/expenses')
      ]);

      const allPeople = peopleRes.data;
      let allExpenses = expensesRes.data;

      // Extrair meses disponíveis
      const months = new Set();
      allExpenses.forEach(exp => {
        if (exp.person_id) {
          const date = new Date(exp.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          months.add(monthKey);
        }
      });
      setAvailableMonths(Array.from(months).sort().reverse());

      // Filtrar por mês se selecionado
      if (selectedMonth !== 'all') {
        const [year, month] = selectedMonth.split('-');
        allExpenses = allExpenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getFullYear() === parseInt(year) && 
                 (expDate.getMonth() + 1) === parseInt(month);
        });
      }

      // Agrupar despesas por pessoa
      const peopleWithExpenses = allPeople.map(person => {
        const personExpenses = allExpenses.filter(exp => exp.person_id === person.id);
        const total = personExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const paid = personExpenses.filter(exp => exp.is_paid_back).reduce((sum, exp) => sum + exp.amount, 0);
        const pending = total - paid;

        return {
          ...person,
          expenseCount: personExpenses.length,
          totalAmount: total,
          paidAmount: paid,
          pendingAmount: pending,
          expenses: personExpenses
        };
      }).filter(p => p.expenseCount > 0); // Apenas pessoas com despesas

      setPeople(peopleWithExpenses);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar gastos por pessoa');
      setLoading(false);
    }
  }, [toast, selectedMonth]);

  useEffect(() => {
    loadPeopleWithExpenses();
  }, [loadPeopleWithExpenses]);

  const togglePersonDetails = (person) => {
    if (selectedPerson?.id === person.id) {
      setSelectedPerson(null);
      setExpenses([]);
    } else {
      setSelectedPerson(person);
      setExpenses(person.expenses);
    }
  };

  const getAvatarColor = (color) => color || '#3b82f6';

  const handleGeneratePdf = async (person) => {
    try {
      toast.info('Gerando relatório...');
      
      const response = await fetch(`http://localhost:5174/api/pdf/person-report/${person.id}`);

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const data = await response.json();
      
      // Abrir HTML em nova janela para impressão
      const newWindow = window.open('', '_blank');
      newWindow.document.write(data.html);
      newWindow.document.close();
      
      // Aguardar carregar e abrir diálogo de impressão
      setTimeout(() => {
        newWindow.print();
      }, 500);

      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar relatório');
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="text-primary" size={32} />
            Gastos por Pessoa
          </h1>
          <p className="text-dark-muted mt-1">Visualize quanto cada pessoa gastou e o status de reembolso</p>
        </div>

        {/* Filtro de Mês */}
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-primary" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 bg-dark-bg border-2 border-dark-border text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos os Meses</option>
            {availableMonths.map(monthKey => {
              const [year, month] = monthKey.split('-');
              return (
                <option key={monthKey} value={monthKey}>
                  {monthNames[parseInt(month) - 1]} {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {people.length === 0 ? (
        <div className="card text-center py-12">
          <Users size={64} className="text-dark-muted mx-auto mb-4" />
          <p className="text-dark-muted text-lg">Nenhuma despesa vinculada a pessoas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {people.map((person) => {
            const isExpanded = selectedPerson?.id === person.id;
            const progressPercentage = person.totalAmount > 0 
              ? (person.paidAmount / person.totalAmount) * 100 
              : 0;

            return (
              <div key={person.id} className="card bg-dark-card border-l-4 border-primary">
                <div 
                  className="cursor-pointer"
                  onClick={() => togglePersonDetails(person)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Avatar */}
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                        style={{ backgroundColor: getAvatarColor(person.avatar_color) }}
                      >
                        {person.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{person.name}</h3>
                        {person.relationship && (
                          <p className="text-sm text-dark-muted mb-2">{person.relationship}</p>
                        )}

                        {/* Estatísticas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                          <div className="bg-dark-bg p-3 rounded-lg">
                            <p className="text-xs text-dark-muted mb-1">Total Gasto</p>
                            <p className="text-lg font-bold text-red-400">
                              R$ {person.totalAmount.toFixed(2)}
                            </p>
                          </div>

                          <div className="bg-dark-bg p-3 rounded-lg">
                            <p className="text-xs text-dark-muted mb-1">Reembolsado</p>
                            <p className="text-lg font-bold text-success">
                              R$ {person.paidAmount.toFixed(2)}
                            </p>
                          </div>

                          <div className="bg-dark-bg p-3 rounded-lg">
                            <p className="text-xs text-dark-muted mb-1">Pendente</p>
                            <p className="text-lg font-bold text-warning">
                              R$ {person.pendingAmount.toFixed(2)}
                            </p>
                          </div>

                          <div className="bg-dark-bg p-3 rounded-lg">
                            <p className="text-xs text-dark-muted mb-1">Despesas</p>
                            <p className="text-lg font-bold text-primary">
                              {person.expenseCount}
                            </p>
                          </div>
                        </div>

                        {/* Barra de Progresso */}
                        {person.totalAmount > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-dark-muted mb-1">
                              <span>Progresso de Reembolso</span>
                              <span>{progressPercentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-dark-border rounded-full h-2">
                              <div
                                className="bg-success rounded-full h-2 transition-all"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGeneratePdf(person);
                          }}
                          className="bg-primary hover:bg-primary/80 text-white p-2 rounded-lg transition-all"
                          title="Gerar PDF"
                        >
                          <FileText size={20} />
                        </button>
                        <TrendingUp 
                          size={24} 
                          className={`text-primary transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalhes Expandidos */}
                {isExpanded && expenses.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-dark-border">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <DollarSign size={18} className="text-primary" />
                      Despesas Detalhadas
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-dark-bg">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted">
                              <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                Data
                              </div>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted">Descrição</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-dark-muted">Categoria</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-dark-muted">Valor</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-dark-muted">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                          {expenses.map((expense) => (
                            <tr key={expense.id} className="hover:bg-dark-bg/50">
                              <td className="px-4 py-3 text-sm">
                                {new Date(expense.date).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="px-4 py-3 text-sm">{expense.description}</td>
                              <td className="px-4 py-3 text-sm">
                                {expense.category_name ? (
                                  <span
                                    className="px-2 py-1 rounded text-xs font-semibold"
                                    style={{ 
                                      backgroundColor: expense.category_color + '20', 
                                      color: expense.category_color 
                                    }}
                                  >
                                    {expense.category_icon} {expense.category_name}
                                  </span>
                                ) : (
                                  <span className="text-dark-muted">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-right font-semibold text-red-400">
                                R$ {expense.amount.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {expense.is_paid_back ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-success/20 text-success">
                                    <CheckCircle size={14} />
                                    Reembolsado
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-warning/20 text-warning">
                                    <XCircle size={14} />
                                    Pendente
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExpensesByPerson;
