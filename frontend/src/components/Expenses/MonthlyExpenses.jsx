import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const MonthlyExpenses = () => {
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthDetails, setMonthDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  useEffect(() => {
    loadMonths();
  }, []);

  const loadMonths = async () => {
    try {
      const response = await api.get('/expenses/grouped-by-month');
      setMonths(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar meses:', error);
      setLoading(false);
    }
  };

  const loadMonthDetails = async (year, month) => {
    try {
      const response = await api.get(`/expenses/monthly/${year}/${month}`);
      setMonthDetails(response.data);
      setSelectedMonth({ year, month });
    } catch (error) {
      console.error('Erro ao carregar detalhes do mês:', error);
    }
  };

  const exportToPDF = async (year, month) => {
    try {
      const response = await api.get(`/pdf/monthly/${year}/${month}`);
      const newWindow = window.open('', '_blank');
      newWindow.document.write(response.data.html);
      newWindow.document.close();
      setTimeout(() => newWindow.print(), 500);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao gerar PDF');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gastos por Mês</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {months.map((month) => (
          <div
            key={`${month.year}-${month.month}`}
            className="bg-dark-card rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 border-2 border-dark-border overflow-hidden"
            onClick={() => loadMonthDetails(month.year, month.month)}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {monthNames[parseInt(month.month) - 1]}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    exportToPDF(month.year, month.month);
                  }}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all"
                  title="Exportar PDF"
                >
                  📄
                </button>
              </div>
              <p className="text-blue-100 text-sm">{month.year}</p>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-red-500 mb-2">
                R$ {parseFloat(month.total).toFixed(2)}
              </p>
              <div className="flex items-center gap-2 text-sm text-dark-muted">
                <span className="bg-dark-bg border border-dark-border px-3 py-1 rounded-full font-semibold">
                  {month.count} {month.count === 1 ? 'despesa' : 'despesas'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMonth && monthDetails && (
        <div className="bg-dark-card rounded-xl shadow-2xl overflow-hidden border border-dark-border">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  📊 {monthNames[parseInt(selectedMonth.month) - 1]} {selectedMonth.year}
                </h2>
                <p className="text-blue-100">Detalhamento completo das despesas</p>
              </div>
              <button
                onClick={() => exportToPDF(selectedMonth.year, selectedMonth.month)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                📄 Exportar PDF
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8 p-6 bg-red-900/20 rounded-xl border-2 border-red-500/30">
              <p className="text-sm text-dark-muted uppercase font-semibold mb-2">Total de Despesas</p>
              <p className="text-5xl font-bold text-red-500">
                R$ {monthDetails.total.toFixed(2)}
              </p>
              <p className="text-sm text-dark-muted mt-2">
                {monthDetails.expenses.length} {monthDetails.expenses.length === 1 ? 'despesa registrada' : 'despesas registradas'}
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border-2 border-dark-border">
              <table className="min-w-full">
                <thead className="bg-dark-bg border-b-2 border-dark-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">📅 Data</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">📝 Descrição</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-dark-text uppercase tracking-wider">🏷️ Categoria</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-dark-text uppercase tracking-wider">💰 Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {monthDetails.expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-dark-bg/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-text">
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-dark-text">{expense.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-sm"
                          style={{ backgroundColor: expense.category_color || '#6b7280' }}
                        >
                          {expense.category_icon} {expense.category_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-base font-bold text-red-500">
                        R$ {expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyExpenses;
