const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initDatabase } = require('./src/utils/database');
const SyncServer = require('./src/sync/syncServer');
const { router: syncRouter, setSyncServer } = require('./src/routes/syncRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5174;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar banco de dados
initDatabase();

// Inicializar servidor de sincronização
const syncServer = new SyncServer(5175);
syncServer.start();
setSyncServer(syncServer);

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/passwords', require('./src/routes/passwordRoutes'));
app.use('/api/password-folders', require('./src/routes/passwordFolderRoutes'));
app.use('/api/expenses', require('./src/routes/expenseRoutes'));
app.use('/api/incomes', require('./src/routes/incomeRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use('/api/people', require('./src/routes/personRoutes'));
app.use('/api/debts', require('./src/routes/debtRoutes'));
app.use('/api/bills', require('./src/routes/billRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));
app.use('/api/reports', require('./src/routes/reportRoutes'));
app.use('/api/installments', require('./src/routes/installmentRoutes'));
app.use('/api/pdf', require('./src/routes/pdfRoutes'));
app.use('/api/sync', syncRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Servir frontend em produção
if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  
  // Tentar diferentes caminhos (dev vs produção empacotada)
  let frontendPath = path.join(__dirname, '../frontend/build');
  
  // Se não existir, tentar caminho do app empacotado (resources/frontend/build)
  if (!fs.existsSync(frontendPath)) {
    frontendPath = path.join(__dirname, 'frontend/build');
  }
  
  console.log('📁 Servindo frontend de:', frontendPath);
  
  if (fs.existsSync(frontendPath)) {
    console.log('✅ Diretório do frontend encontrado');
    
    // Servir arquivos estáticos
    app.use(express.static(frontendPath));
    
    // Todas as outras rotas (não-API) servem o index.html
    app.get('*', (req, res) => {
      // Não servir index.html para rotas da API
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    console.error('❌ Diretório do frontend não encontrado:', frontendPath);
    console.error('❌ Execute: npm run build');
  }
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
});
