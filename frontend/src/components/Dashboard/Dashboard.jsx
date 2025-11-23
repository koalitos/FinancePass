import React, { useState, useEffect } from 'react';
import { getDashboardSummary } from '../../api/api';
import { Wallet, TrendingUp, TrendingDown, Lock, Users, Calendar, AlertCircle } from 'lucide-react';
import api from '../../api/api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingBills, setUpcomingBills] = useState([]);

  useEffect(() => {
    loadSummary();
    loadUpcomingBills();
  }, []);

  const loadSummary = async () => {
    try {
      const response = await getDashboardSummary();
      setSummary(response.data);
    } catch (error) {
      console.error('Erro ao carregar resumo:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUpcomingBills = async () => {
    try {
      const response = await api.get('/bills');
      const bills = response.data;
      
      // Filtrar contas dos próximos 7 dias
      const today = new Date();
      const currentDay = today.getDate();
      
      const upcoming = bills
        .filter(bill => bill.is_active)
        .map(bill => {
          const daysUntil = bill.due_day - currentDay;
          return { ...bill, daysUntil };
        })
        .filter(bill => bill.daysUntil >= 0 && bill.daysUntil <= 7)
        .sort((a, b) => a.daysUntil - b.daysUntil);
      
      setUpcomingBills(upcoming);
    } catch (error) {
      // Silenciar erro se a rota não existir (404)
      if (error.response?.status !== 404) {
        console.error('Erro ao carregar contas próximas:', error);
      }
      setUpcomingBills([]);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  const cards = [
    {
      title: 'Receitas do Mês',
      value: `R$ ${summary?.total_income?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Despesas do Mês',
      value: `R$ ${summary?.total_expenses?.toFixed(2) || '0.00'}`,
      icon: TrendingDown,
      color: 'text-danger',
      bgColor: 'bg-danger/10',
    },
    {
      title: 'Balanço',
      value: `R$ ${summary?.balance?.toFixed(2) || '0.00'}`,
      icon: Wallet,
      color: summary?.balance >= 0 ? 'text-success' : 'text-danger',
      bgColor: summary?.balance >= 0 ? 'bg-success/10' : 'bg-danger/10',
    },
    {
      title: 'Pessoas Devendo',
      value: `R$ ${summary?.total_owed?.toFixed(2) || '0.00'}`,
      icon: Users,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Senhas Salvas',
      value: summary?.total_passwords || '0',
      icon: Lock,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  // Obter mês atual
  const currentDate = new Date();
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-dark-muted text-sm">📅 {currentMonth} {currentYear}</p>
          </div>
        </div>
      </div>
      
      <div className="page-content space-y-4">
        <div className="grid-compact grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="card-compact">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-dark-muted text-xs mb-1">{card.title}</p>
                    <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={card.color} size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid-compact grid-cols-1 lg:grid-cols-2">
          {/* Resumo Mensal */}
          <div className="card-compact">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="text-primary" size={20} />
              Resumo Mensal
            </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-dark-muted">Total de Receitas:</span>
              <span className="font-semibold text-success">
                R$ {summary?.total_income?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-dark-muted">Total de Despesas:</span>
              <span className="font-semibold text-danger">
                R$ {summary?.total_expenses?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="border-t border-dark-border pt-3 flex justify-between items-center">
              <span className="font-semibold">Saldo:</span>
              <span className={`font-bold text-xl ${summary?.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                R$ {summary?.balance?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>

          {/* Contas Próximas */}
          <div className="card-compact">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="text-warning" size={20} />
              Contas Próximas (7 dias)
            </h2>
            {upcomingBills.length === 0 ? (
              <p className="text-dark-muted text-center py-3 text-sm">Nenhuma conta próxima</p>
            ) : (
              <div className="space-y-compact">
                {upcomingBills.map((bill) => (
                  <div 
                    key={bill.id} 
                    className={`p-3 rounded-lg border-l-4 ${
                      bill.daysUntil === 0 
                        ? 'bg-red-900/20 border-red-500' 
                        : bill.daysUntil <= 3 
                        ? 'bg-orange-900/20 border-orange-500' 
                        : 'bg-yellow-900/20 border-yellow-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold">{bill.name}</p>
                        <p className="text-sm text-dark-muted mt-1">
                          Vencimento: Dia {bill.due_day}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-danger">
                          R$ {bill.amount.toFixed(2)}
                        </p>
                        <p className={`text-xs font-semibold mt-1 ${
                          bill.daysUntil === 0 
                            ? 'text-red-400' 
                            : bill.daysUntil <= 3 
                            ? 'text-orange-400' 
                            : 'text-yellow-400'
                        }`}>
                          {bill.daysUntil === 0 ? 'Hoje!' : `${bill.daysUntil} dias`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
