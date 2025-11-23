import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import PasswordList from './components/Passwords/PasswordList';
import ExpenseList from './components/Expenses/ExpenseList';
import MonthlyExpenses from './components/Expenses/MonthlyExpenses';
import InstallmentForm from './components/Expenses/InstallmentForm';
import InstallmentList from './components/Expenses/InstallmentList';
import ExpensesByPerson from './components/Expenses/ExpensesByPerson';
import IncomeList from './components/Incomes/IncomeList';
import MonthlyIncomes from './components/Incomes/MonthlyIncomes';
import TestIncomes from './components/Incomes/TestIncomes';
import PeopleList from './components/People/PeopleList';
import DebtList from './components/Debts/DebtList';
import RecurringBills from './components/Bills/RecurringBills';
import OverdueBills from './components/Bills/OverdueBills';
import SystemStatus from './components/System/SystemStatus';
import BackupManager from './components/System/BackupManager';
import SyncManager from './components/Sync/SyncManager';
import Login from './components/Auth/Login';
import UpdateNotification from './components/Layout/UpdateNotification';
import AutoUpdater from './components/Layout/AutoUpdater';


function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [backendError] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Verificar se há usuário no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    // Verificar se é primeiro acesso (se não tem senha salva)
    const hasMasterPassword = localStorage.getItem('masterPassword');
    setIsFirstAccess(!hasMasterPassword);
    setLoading(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dark-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-muted">Carregando...</p>
        </div>
      </div>
    );
  }

  if (backendError) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full card text-center">
          <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Backend Offline</h2>
          <p className="text-dark-muted mb-4">
            Não foi possível conectar ao servidor backend.
          </p>
          <div className="bg-dark-bg p-4 rounded-lg text-left text-sm mb-4">
            <p className="font-semibold mb-2">Para iniciar o backend:</p>
            <code className="block bg-dark-card p-2 rounded">npm run dev:backend</code>
            <p className="mt-2 text-dark-muted">Ou inicie tudo de uma vez:</p>
            <code className="block bg-dark-card p-2 rounded mt-1">npm run dev</code>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary w-full"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} isFirstAccess={isFirstAccess} />;
  }

  return (
    <ToastProvider>
      <Router>
        <div className="flex h-screen bg-dark-bg">
        <Sidebar isOpen={sidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            user={user}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/passwords" element={<PasswordList />} />
              <Route path="/expenses" element={<ExpenseList />} />
              <Route path="/expenses/monthly" element={<MonthlyExpenses />} />
              <Route path="/expenses/by-person" element={<ExpensesByPerson />} />
              <Route path="/expenses/installments" element={<InstallmentList />} />
              <Route path="/expenses/installments/new" element={<InstallmentForm />} />
              <Route path="/bills" element={<RecurringBills />} />
              <Route path="/bills/overdue" element={<OverdueBills />} />
              <Route path="/incomes" element={<IncomeList />} />
              <Route path="/incomes/test" element={<TestIncomes />} />
              <Route path="/incomes/monthly" element={<MonthlyIncomes />} />
              <Route path="/people" element={<PeopleList />} />
              <Route path="/debts" element={<DebtList />} />
              <Route path="/backup" element={<BackupManager />} />
              <Route path="/sync" element={<SyncManager />} />
              <Route path="/system" element={<SystemStatus />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
          <UpdateNotification />
          <AutoUpdater />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
