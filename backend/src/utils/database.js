const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Determinar o caminho correto para os dados do usuário
let userDataPath;

// Se estiver rodando no Electron, usar app.getPath('userData')
if (process.env.ELECTRON_USER_DATA) {
  userDataPath = process.env.ELECTRON_USER_DATA;
} else {
  // Fallback para desenvolvimento
  userDataPath = path.join(__dirname, '../..');
}

// Criar diretório de dados se não existir
const dataDir = path.join(userDataPath, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Diretório de dados criado:', dataDir);
}

const dbPath = path.join(dataDir, 'database.db');
console.log('📊 Banco de dados:', dbPath);

// Migração automática: copiar banco antigo se existir
const oldDbPath = path.join(__dirname, '../../database.db');
if (fs.existsSync(oldDbPath) && !fs.existsSync(dbPath)) {
  console.log('🔄 Migrando banco de dados antigo...');
  try {
    fs.copyFileSync(oldDbPath, dbPath);
    console.log('✅ Banco de dados migrado com sucesso!');
    console.log('   De:', oldDbPath);
    console.log('   Para:', dbPath);
  } catch (err) {
    console.error('❌ Erro ao migrar banco de dados:', err);
  }
}

const db = new sqlite3.Database(dbPath);

function initDatabase() {
  db.serialize(() => {
    // Migração: Adicionar coluna installment_id se não existir
    db.run(`PRAGMA table_info(expenses)`, (err, rows) => {
      if (!err) {
        db.all(`PRAGMA table_info(expenses)`, (err, columns) => {
          const hasInstallmentId = columns?.some(col => col.name === 'installment_id');
          if (!hasInstallmentId) {
            console.log('🔧 Adicionando coluna installment_id à tabela expenses...');
            db.run(`ALTER TABLE expenses ADD COLUMN installment_id INTEGER REFERENCES installments(id)`, (err) => {
              if (err) {
                console.error('Erro ao adicionar coluna installment_id:', err);
              } else {
                console.log('✅ Coluna installment_id adicionada com sucesso!');
              }
            });
          }
        });
      }
    });

    // Migração: Adicionar coluna folder_id à tabela passwords se não existir
    db.all(`PRAGMA table_info(passwords)`, (err, columns) => {
      if (!err && columns) {
        const hasFolderId = columns.some(col => col.name === 'folder_id');
        if (!hasFolderId) {
          console.log('🔧 Adicionando coluna folder_id à tabela passwords...');
          db.run(`ALTER TABLE passwords ADD COLUMN folder_id INTEGER REFERENCES password_folders(id)`, (err) => {
            if (err) {
              console.error('Erro ao adicionar coluna folder_id:', err);
            } else {
              console.log('✅ Coluna folder_id adicionada com sucesso!');
            }
          });
        }
      }
    });

    // Migração: Adicionar coluna favorite à tabela passwords se não existir
    db.all(`PRAGMA table_info(passwords)`, (err, columns) => {
      if (!err && columns) {
        const hasFavorite = columns.some(col => col.name === 'favorite');
        if (!hasFavorite) {
          console.log('🔧 Adicionando coluna favorite à tabela passwords...');
          db.run(`ALTER TABLE passwords ADD COLUMN favorite BOOLEAN DEFAULT 0`, (err) => {
            if (err) {
              console.error('Erro ao adicionar coluna favorite:', err);
            } else {
              console.log('✅ Coluna favorite adicionada com sucesso!');
            }
          });
        }
      }
    });

    // Tabela de senhas
    db.run(`CREATE TABLE IF NOT EXISTS passwords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      username TEXT,
      email TEXT,
      password_encrypted TEXT NOT NULL,
      url TEXT,
      notes TEXT,
      category TEXT,
      folder_id INTEGER,
      favorite BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (folder_id) REFERENCES password_folders(id)
    )`);

    // Tabela de categorias
    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      color TEXT,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(name, type)
    )`);

    // Tabela de pessoas
    db.run(`CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      relationship TEXT,
      phone TEXT,
      email TEXT,
      notes TEXT,
      avatar_color TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de gastos
    db.run(`CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      category_id INTEGER,
      payment_method TEXT,
      date DATE NOT NULL,
      is_recurring BOOLEAN DEFAULT 0,
      recurrence_type TEXT,
      person_id INTEGER,
      is_paid_back BOOLEAN DEFAULT 0,
      paid_back_date DATE,
      notes TEXT,
      installment_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (person_id) REFERENCES people(id),
      FOREIGN KEY (installment_id) REFERENCES installments(id)
    )`);

    // Tabela de compras parceladas
    db.run(`CREATE TABLE IF NOT EXISTS installments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      total_amount REAL NOT NULL,
      installment_count INTEGER NOT NULL,
      installment_value REAL NOT NULL,
      category_id INTEGER,
      payment_method TEXT,
      start_date DATE NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`);

    // Tabela de receitas
    db.run(`CREATE TABLE IF NOT EXISTS incomes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      category_id INTEGER,
      source TEXT,
      date DATE NOT NULL,
      is_recurring BOOLEAN DEFAULT 0,
      recurrence_type TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`);

    // Tabela de dívidas
    db.run(`CREATE TABLE IF NOT EXISTS debts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      person_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      total_amount REAL NOT NULL,
      paid_amount REAL DEFAULT 0,
      type TEXT NOT NULL,
      due_date DATE,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (person_id) REFERENCES people(id)
    )`);

    // Tabela de pagamentos de dívidas
    db.run(`CREATE TABLE IF NOT EXISTS debt_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      debt_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_date DATE NOT NULL,
      payment_method TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (debt_id) REFERENCES debts(id)
    )`);

    // Tabela de orçamentos
    db.run(`CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      limit_amount REAL NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      UNIQUE(category_id, month, year)
    )`);

    // Tabela de metas financeiras
    db.run(`CREATE TABLE IF NOT EXISTS financial_goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      target_amount REAL NOT NULL,
      current_amount REAL DEFAULT 0,
      deadline DATE,
      category TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabela de contas mensais recorrentes
    db.run(`CREATE TABLE IF NOT EXISTS recurring_bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      amount REAL NOT NULL,
      category_id INTEGER,
      due_day INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      auto_create BOOLEAN DEFAULT 1,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`);

    // Tabela de pagamentos de contas
    db.run(`CREATE TABLE IF NOT EXISTS bill_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recurring_bill_id INTEGER,
      expense_id INTEGER,
      due_date DATE NOT NULL,
      paid_date DATE,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recurring_bill_id) REFERENCES recurring_bills(id),
      FOREIGN KEY (expense_id) REFERENCES expenses(id)
    )`);

    // Tabela de pastas para senhas
    db.run(`CREATE TABLE IF NOT EXISTS password_folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      parent_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES password_folders(id)
    )`);

    // Tabela de usuários
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Inserir categorias padrão
    insertDefaultCategories();
  });

  console.log('✅ Database initialized');
}

function insertDefaultCategories() {
  const defaultCategories = [
    // Receitas
    { name: 'Salário', type: 'income', color: '#10b981', icon: '💰' },
    { name: 'Freelance', type: 'income', color: '#3b82f6', icon: '💼' },
    { name: 'Investimentos', type: 'income', color: '#8b5cf6', icon: '📈' },
    { name: 'Presentes', type: 'income', color: '#ec4899', icon: '🎁' },
    { name: 'Outros', type: 'income', color: '#6b7280', icon: '💵' },
    
    // Despesas
    { name: 'Moradia', type: 'expense', color: '#ef4444', icon: '🏠' },
    { name: 'Alimentação', type: 'expense', color: '#f59e0b', icon: '🍔' },
    { name: 'Transporte', type: 'expense', color: '#3b82f6', icon: '🚗' },
    { name: 'Saúde', type: 'expense', color: '#10b981', icon: '💊' },
    { name: 'Educação', type: 'expense', color: '#8b5cf6', icon: '🎓' },
    { name: 'Lazer', type: 'expense', color: '#ec4899', icon: '🎮' },
    { name: 'Vestuário', type: 'expense', color: '#06b6d4', icon: '👕' },
    { name: 'Contas', type: 'expense', color: '#f97316', icon: '📱' },
    { name: 'Cartão de Crédito', type: 'expense', color: '#dc2626', icon: '💳' },
    { name: 'Outros', type: 'expense', color: '#6b7280', icon: '💸' }
  ];

  const stmt = db.prepare(`INSERT OR IGNORE INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)`);
  defaultCategories.forEach(cat => {
    stmt.run(cat.name, cat.type, cat.color, cat.icon);
  });
  stmt.finalize();
}

module.exports = { db, initDatabase };
