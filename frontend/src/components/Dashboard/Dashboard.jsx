import React, { useState, useEffect } from 'react';
import { getDashboardSummary } from '../../api/api';
import { Wallet, TrendingUp, TrendingDown, Lock, Users, Calendar, AlertCircle, PieChart, Target, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import GlassCard from '../Common/GlassCard';

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
    return (
      <div className="flex items-center justify-center h-full">
        <GlassCard className="text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/30 border-t-blue-500"></div>
            <p className="text-gray-400">Carregando dashboard...</p>
          </div>
        </GlassCard>
      </div>
    );
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
    <div className="page-container relative">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles size={28} className="text-primary" />
              Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">📅 {currentMonth} {currentYear}</p>
          </div>
        </div>
      </div>
      
      <div className="page-content space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <GlassCard key={index} gradient={index === 2}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs mb-2">{card.title}</p>
                    <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${card.bgColor}`} style={{
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <Icon className={card.color} size={24} />
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Links Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/budget">
            <GlassCard className="group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-all">
                  <TrendingUp className="text-blue-400" size={22} />
                </div>
                <div>
                  <p className="font-semibold text-white">Orçamento</p>
                  <p className="text-xs text-gray-400">Controle seus gastos</p>
                </div>
              </div>
            </GlassCard>
          </Link>

          <Link to="/charts">
            <GlassCard className="group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-all">
                  <PieChart className="text-green-400" size={22} />
                </div>
                <div>
                  <p className="font-semibold text-white">Gráficos</p>
                  <p className="text-xs text-gray-400">Visualize suas finanças</p>
                </div>
              </div>
            </GlassCard>
          </Link>

          <Link to="/goals">
            <GlassCard className="group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-all">
                  <Target className="text-yellow-400" size={22} />
                </div>
                <div>
                  <p className="font-semibold text-white">Metas</p>
                  <p className="text-xs text-gray-400">Defina seus objetivos</p>
                </div>
              </div>
            </GlassCard>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Resumo Mensal */}
          <GlassCard>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
              <Calendar className="text-blue-400" size={22} />
              Resumo Mensal
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-gray-400">Total de Receitas:</span>
                <span className="font-semibold text-green-400">
                  R$ {summary?.total_income?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-gray-400">Total de Despesas:</span>
                <span className="font-semibold text-red-400">
                  R$ {summary?.total_expenses?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <span className="font-semibold text-white">Saldo:</span>
                <span className={`font-bold text-xl ${summary?.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  R$ {summary?.balance?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Contas Próximas */}
          <GlassCard>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
              <AlertCircle className="text-yellow-400" size={22} />
              Contas Próximas (7 dias)
            </h2>
            {upcomingBills.length === 0 ? (
              <p className="text-gray-400 text-center py-6 text-sm">Nenhuma conta próxima</p>
            ) : (
              <div className="space-y-3">
                {upcomingBills.map((bill) => (
                  <div 
                    key={bill.id} 
                    className={`p-3 rounded-lg border-l-4 transition-all ${
                      bill.daysUntil === 0 
                        ? 'bg-red-500/20 border-red-500' 
                        : bill.daysUntil <= 3 
                        ? 'bg-orange-500/20 border-orange-500' 
                        : 'bg-yellow-500/20 border-yellow-500'
                    }`}
                    style={{ backdropFilter: 'blur(10px)' }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-white">{bill.name}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Vencimento: Dia {bill.due_day}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-400">
                          R$ {bill.amount.toFixed(2)}
                        </p>
                        <p className={`text-xs font-semibold mt-1 ${
                          bill.daysUntil === 0 
                            ? 'text-red-300' 
                            : bill.daysUntil <= 3 
                            ? 'text-orange-300' 
                            : 'text-yellow-300'
                        }`}>
                          {bill.daysUntil === 0 ? 'Hoje!' : `${bill.daysUntil} dias`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
