import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Lock, Wallet, TrendingUp, Users, CreditCard, Smartphone, ChevronDown, ChevronRight, Calendar, CreditCard as InstallmentIcon, Receipt, AlertCircle, Shield, Briefcase, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import KofiButton from '../Common/KofiButton';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [expensesOpen, setExpensesOpen] = useState(false);
  const [billsOpen, setBillsOpen] = useState(false);
  const [incomesOpen, setIncomesOpen] = useState(false);
  const [spendingControlOpen, setSpendingControlOpen] = useState(false);

  // Manter menus abertos se estiver em uma das rotas
  useEffect(() => {
    if (location.pathname.startsWith('/expenses') || 
        location.pathname.startsWith('/bills') || 
        location.pathname.startsWith('/incomes') ||
        location.pathname.startsWith('/people') || 
        location.pathname.startsWith('/debts')) {
      setSpendingControlOpen(true);
    }
    if (location.pathname.startsWith('/expenses')) {
      setExpensesOpen(true);
    }
    if (location.pathname.startsWith('/bills')) {
      setBillsOpen(true);
    }
    if (location.pathname.startsWith('/incomes')) {
      setIncomesOpen(true);
    }
  }, [location.pathname]);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: t('menu.dashboard') },
    { path: '/passwords', icon: Lock, label: t('menu.passwords') },
    {
      path: '/spending-control',
      icon: Briefcase,
      label: t('menu.wallet'),
      submenu: [
        { 
          path: '/expenses', 
          label: t('menu.expenses'),
          submenu: [
            { path: '/expenses', label: 'Todas as Despesas' },
            { path: '/expenses/monthly', label: 'Gastos por Mês' },
            { path: '/expenses/by-person', label: 'Gastos por Pessoa' },
            { path: '/expenses/installments', label: 'Compras Parceladas' },
          ]
        },
        {
          path: '/bills',
          label: 'Contas',
          submenu: [
            { path: '/bills', label: 'Contas Mensais' },
            { path: '/bills/overdue', label: 'Contas Atrasadas' },
          ]
        },
        {
          path: '/incomes',
          label: t('menu.incomes'),
          submenu: [
            { path: '/incomes', label: 'Todas as Receitas' },
            { path: '/incomes/monthly', label: 'Receitas por Mês' },
          ]
        },
        { path: '/people', label: t('menu.people') },
        { path: '/debts', label: t('menu.debts') },
      ]
    },
    { path: '/backup', icon: Shield, label: 'Backup' },
    { path: '/sync', icon: Smartphone, label: 'Sincronização' },
  ];

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-dark-card border-r border-dark-border flex flex-col">
      <div className="p-6 border-b border-dark-border">
        <h1 className="text-2xl font-bold text-primary">💰 {t('app.name')}</h1>
        <p className="text-dark-muted text-sm mt-1">{t('app.tagline')}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isSpendingControlMenu = item.path === '/spending-control';
          const isExpensesMenu = item.path === '/expenses';
          const isBillsMenu = item.path === '/bills';
          const isIncomesMenu = item.path === '/incomes';
          
          if (hasSubmenu) {
            const isOpen = isSpendingControlMenu ? spendingControlOpen : isExpensesMenu ? expensesOpen : isBillsMenu ? billsOpen : isIncomesMenu ? incomesOpen : false;
            const toggleOpen = isSpendingControlMenu
              ? () => setSpendingControlOpen(!spendingControlOpen)
              : isExpensesMenu 
              ? () => setExpensesOpen(!expensesOpen)
              : isBillsMenu 
              ? () => setBillsOpen(!billsOpen)
              : isIncomesMenu
              ? () => setIncomesOpen(!incomesOpen)
              : () => {};
            
            const isMenuActive = isSpendingControlMenu 
              ? (location.pathname.startsWith('/expenses') || location.pathname.startsWith('/bills') || location.pathname.startsWith('/incomes') || location.pathname === '/people' || location.pathname === '/debts')
              : location.pathname.startsWith(item.path);
            
            return (
              <div key={item.path}>
                <button
                  onClick={toggleOpen}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition ${
                    isMenuActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-dark-text hover:bg-dark-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </div>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {isOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subitem) => {
                      const isSubActive = location.pathname === subitem.path;
                      const hasNestedSubmenu = subitem.submenu && subitem.submenu.length > 0;
                      
                      if (hasNestedSubmenu) {
                        const isNestedExpensesMenu = subitem.path === '/expenses';
                        const isNestedBillsMenu = subitem.path === '/bills';
                        const isNestedIncomesMenu = subitem.path === '/incomes';
                        const isNestedOpen = isNestedExpensesMenu ? expensesOpen : isNestedBillsMenu ? billsOpen : isNestedIncomesMenu ? incomesOpen : false;
                        const toggleNestedOpen = isNestedExpensesMenu 
                          ? () => setExpensesOpen(!expensesOpen)
                          : isNestedBillsMenu 
                          ? () => setBillsOpen(!billsOpen)
                          : isNestedIncomesMenu
                          ? () => setIncomesOpen(!incomesOpen)
                          : () => {};
                        const isNestedMenuActive = location.pathname.startsWith(subitem.path);
                        
                        return (
                          <div key={subitem.path}>
                            <button
                              onClick={toggleNestedOpen}
                              className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg transition text-sm ${
                                isNestedMenuActive
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-dark-text hover:bg-dark-border'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Circle size={16} />
                                <span>{subitem.label}</span>
                              </div>
                              {isNestedOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            {isNestedOpen && (
                              <div className="ml-4 mt-1 space-y-1">
                                {subitem.submenu.map((nestedItem) => {
                                  const isNestedActive = location.pathname === nestedItem.path;
                                  return (
                                    <Link
                                      key={nestedItem.path}
                                      to={nestedItem.path}
                                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-xs ${
                                        isNestedActive
                                          ? 'bg-primary text-white'
                                          : 'text-dark-text hover:bg-dark-border'
                                      }`}
                                    >
                                      <Circle size={12} />
                                      <span>{nestedItem.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }
                      
                      return (
                        <Link
                          key={subitem.path}
                          to={subitem.path}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm ${
                            isSubActive
                              ? 'bg-primary text-white'
                              : 'text-dark-text hover:bg-dark-border'
                          }`}
                        >
                          <Circle size={16} />
                          <span>{subitem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-dark-text hover:bg-dark-border'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-dark-border space-y-3">
        <KofiButton variant="sidebar" />
        <p className="text-dark-muted text-xs text-center">v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
