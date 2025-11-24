import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import api from '../../api/api';
import { TrendingUp, TrendingDown, PieChart as PieIcon, BarChart3 } from 'lucide-react';

const FinancialCharts = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  const loadChartData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadMonthlyTrends(),
        loadCategoryBreakdown()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyTrends = async () => {
    try {
      const months = [];
      for (let month = 1; month <= 12; month++) {
        const response = await api.get(`/reports/monthly/${selectedYear}/${month}`);
        months.push({
          month: getMonthName(month),
          monthNum: month,
          receitas: response.data.income || 0,
          despesas: response.data.expenses || 0,
          saldo: response.data.balance || 0
        });
      }
      setMonthlyData(months);
    } catch (error) {
      console.error('Erro ao carregar tendências mensais:', error);
    }
  };

  const loadCategoryBreakdown = async () => {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const dateFilter = `${selectedYear}-${currentMonth.toString().padStart(2, '0')}`;
      
      const response = await api.get('/expenses');
      const expenses = response.data.filter(exp => 
        exp.date.startsWith(dateFilter) && !exp.installment_id
      );

      // Agrupar por categoria
      const categoryMap = {};
      expenses.forEach(exp => {
        const catName = exp.category_name || 'Sem Categoria';
        if (!categoryMap[catName]) {
          categoryMap[catName] = {
            name: catName,
            value: 0,
            color: exp.category_color || '#6b7280'
          };
        }
        categoryMap[catName].value += exp.amount;
      });

      const data = Object.values(categoryMap).sort((a, b) => b.value - a.value);
      setCategoryData(data);
    } catch (error) {
      console.error('Erro ao carregar breakdown por categoria:', error);
    }
  };

  useEffect(() => {
    loadChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const getMonthName = (month) => {
    const names = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                   'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return names[month - 1];
  };

  const formatCurrency = (value) => {
    return `R$ ${value.toFixed(2)}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-dark-border p-3 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="text-center py-12">Carregando gráficos...</div>
      </div>
    );
  }

  const totalIncome = monthlyData.reduce((sum, m) => sum + m.receitas, 0);
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.despesas, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">📊 Gráficos e Análises</h1>
            <p className="text-dark-muted text-sm">Visualize suas finanças</p>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="input"
          >
            {[2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="page-content space-y-4">
        {/* Cards de Resumo */}
        <div className="grid-compact grid-cols-1 md:grid-cols-3">
          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-muted text-xs mb-1">Total Receitas {selectedYear}</p>
                <p className="text-xl font-bold text-success">{formatCurrency(totalIncome)}</p>
              </div>
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="text-success" size={20} />
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-muted text-xs mb-1">Total Despesas {selectedYear}</p>
                <p className="text-xl font-bold text-danger">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="p-2 rounded-lg bg-danger/10">
                <TrendingDown className="text-danger" size={20} />
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-muted text-xs mb-1">Saldo {selectedYear}</p>
                <p className={`text-xl font-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${balance >= 0 ? 'bg-success/10' : 'bg-danger/10'}`}>
                <BarChart3 className={balance >= 0 ? 'text-success' : 'text-danger'} size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de Linha - Tendência Mensal */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="text-primary" size={20} />
            Tendência Mensal - {selectedYear}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="receitas" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Receitas"
                dot={{ fill: '#10b981' }}
              />
              <Line 
                type="monotone" 
                dataKey="despesas" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Despesas"
                dot={{ fill: '#ef4444' }}
              />
              <Line 
                type="monotone" 
                dataKey="saldo" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Saldo"
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid-compact grid-cols-1 lg:grid-cols-2">
          {/* Gráfico de Barras - Comparação Mensal */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="text-primary" size={20} />
              Receitas vs Despesas
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
                <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Pizza - Gastos por Categoria */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieIcon className="text-primary" size={20} />
              Gastos por Categoria (Mês Atual)
            </h2>
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((cat, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: cat.color || COLORS[index % COLORS.length] }}
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(cat.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-dark-muted py-8">
                Nenhuma despesa registrada neste mês
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialCharts;
