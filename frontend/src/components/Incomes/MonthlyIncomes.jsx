import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Calendar, DollarSign, FileText } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import api from '../../api/api';

const MonthlyIncomes = () => {
  console.log('🔵 MonthlyIncomes component mounted');
  const toast = useToastContext();
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthDetails, setMonthDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const loadMonths = useCallback(async () => {
    try {
      console.log('Carregando receitas por mês...');
      const response = await api.get('/incomes/grouped-by-month');
      console.log('Resposta:', response.data);
      setMonths(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro completo ao carregar meses:', error);
      console.error('Resposta do erro:', error.response);
      toast.error(`Erro ao carregar receitas: ${error.message}`);
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadMonths();
  }, [loadMonths]);

  const loadMonthDetails = async (year, month) => {
    try {
      const response = await api.get(`/incomes/monthly/${year}/${month}`);
      setMonthDetails(response.data);
      setSelectedMonth({ year, month });
    } catch (error) {
      console.error('Erro ao carregar detalhes do mês:', error);
      toast.error('Erro ao carregar detalhes');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-dark-border border-t-primary rounded-full animate-spin"></div>
        <p className="ml-4 text-dark-muted">Carregando receitas...</p>
      </div>
    );
  }

  console.log('Renderizando MonthlyIncomes, meses:', months);
  console.log('Loading:', loading);

  // Teste simples
  if (!loading && months.length === 0) {
    console.log('⚠️ Nenhum mês encontrado');
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="text-success" size={32} />
            Receitas por Mês
          </h1>
          <p className="text-dark-muted mt-1">Visualize suas receitas organizadas por mês</p>
        </div>
      </div>

      {months.length === 0 ? (
        <div className="card text-center py-12">
          <TrendingUp size={64} className="text-dark-muted mx-auto mb-4" />
          <p className="text-dark-muted text-lg">Nenhuma receita cadastrada</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {months.map((month) => (
              <div
                key={`${month.year}-${month.month}`}
                className="card bg-dark-card hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 border-2 border-dark-border hover:border-success/50 overflow-hidden"
                onClick={() => loadMonthDetails(month.year, month.month)}
              >
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar size={20} />
                      <h3 className="text-xl font-bold">
                        {monthNames[parseInt(month.month) - 1]}
                      </h3>
                    </div>
                    <TrendingUp size={24} />
                  </div>
                  <p className="text-green-100 text-sm mt-1">{month.year}</p>
                </div>
                <div className="p-6">
                  <p className="text-3xl font-bold text-success mb-2">
                    R$ {parseFloat(month.total).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-dark-muted">
                    <span className="bg-success/20 text-success border border-success/30 px-3 py-1 rounded-full font-semibold">
                      {month.count} {month.count === 1 ? 'receita' : 'receitas'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedMonth && monthDetails && (
            <div className="card bg-dark-card overflow-hidden border-2 border-success/30">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                      <FileText size={32} />
                      {monthNames[parseInt(selectedMonth.month) - 1]} {selectedMonth.year}
                    </h2>
                    <p className="text-green-100">Detalhamento completo das receitas</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMonth(null);
                      setMonthDetails(null);
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                  >
                    Fechar
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-8 p-6 bg-green-900/20 rounded-xl border-2 border-success/30">
                  <p className="text-sm text-dark-muted uppercase font-semibold mb-2">Total de Receitas</p>
                  <p className="text-5xl font-bold text-success">
                    R$ {monthDetails.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-dark-muted mt-2">
                    {monthDetails.incomes.length} {monthDetails.incomes.length === 1 ? 'receita registrada' : 'receitas registradas'}
                  </p>
                </div>

                <div className="overflow-x-auto rounded-xl border-2 border-dark-border">
                  <table className="min-w-full">
                    <thead className="bg-dark-bg border-b-2 border-dark-border">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            Data
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <FileText size={16} />
                            Descrição
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">
                          Fonte
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-dark-text uppercase tracking-wider">
                          <div className="flex items-center justify-end gap-2">
                            <DollarSign size={16} />
                            Valor
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-border">
                      {monthDetails.incomes.map((income) => (
                        <tr key={income.id} className="hover:bg-dark-bg/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-text">
                            {new Date(income.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 text-sm text-dark-text">
                            {income.description}
                            {income.is_recurring && (
                              <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                🔄 Recorrente
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {income.category_name ? (
                              <span
                                className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-sm"
                                style={{ backgroundColor: income.category_color || '#10b981' }}
                              >
                                {income.category_icon} {income.category_name}
                              </span>
                            ) : (
                              <span className="text-dark-muted">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-dark-muted">
                            {income.source || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-base font-bold text-success">
                            R$ {income.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MonthlyIncomes;
