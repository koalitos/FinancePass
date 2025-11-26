import axios from 'axios';

const API_URL = 'http://localhost:5174/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para tratar erros de forma consistente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - backend não respondeu a tempo');
      error.message = 'O servidor demorou muito para responder. Tente novamente.';
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('Network error - backend não está acessível');
      error.message = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
    }
    return Promise.reject(error);
  }
);

// Passwords
export const getPasswords = () => api.get('/passwords');
export const getPassword = (id) => api.get(`/passwords/${id}`);
export const createPassword = (data) => api.post('/passwords', data);
export const updatePassword = (id, data) => api.put(`/passwords/${id}`, data);
export const deletePassword = (id) => api.delete(`/passwords/${id}`);
export const searchPasswords = (query) => api.get(`/passwords/search?q=${query}`);

// Expenses
export const getExpenses = () => api.get('/expenses');
export const getExpense = (id) => api.get(`/expenses/${id}`);
export const createExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const getMonthlyExpenses = (year, month) => api.get(`/expenses/monthly/${year}/${month}`);
export const getExpensesByCategory = () => api.get('/expenses/category');

// Incomes
export const getIncomes = () => api.get('/incomes');
export const getIncome = (id) => api.get(`/incomes/${id}`);
export const createIncome = (data) => api.post('/incomes', data);
export const updateIncome = (id, data) => api.put(`/incomes/${id}`, data);
export const deleteIncome = (id) => api.delete(`/incomes/${id}`);

// People
export const getPeople = () => api.get('/people');
export const getPerson = (id) => api.get(`/people/${id}`);
export const createPerson = (data) => api.post('/people', data);
export const updatePerson = (id, data) => api.put(`/people/${id}`, data);
export const deletePerson = (id) => api.delete(`/people/${id}`);
export const getPersonExpenses = (id) => api.get(`/people/${id}/expenses`);
export const getPersonSummary = (id) => api.get(`/people/${id}/summary`);

// Debts
export const getDebts = () => api.get('/debts');
export const createDebt = (data) => api.post('/debts', data);
export const addDebtPayment = (id, data) => api.post(`/debts/${id}/payment`, data);

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);

// Dashboard
export const getDashboardSummary = () => api.get('/dashboard/summary');

// Reports
export const getMonthlyReport = (year, month) => api.get(`/reports/monthly/${year}/${month}`);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const checkFirstAccess = () => api.get('/auth/first-access');

export { API_URL };
export default api;
