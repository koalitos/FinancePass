const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Recriando tabela financial_goals');
console.log('📁 Banco de dados:', dbPath);

db.serialize(() => {
  // Verificar se a tabela existe
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='financial_goals'", [], (err, row) => {
    if (err) {
      console.error('❌ Erro:', err);
      db.close();
      return;
    }
    
    if (row) {
      console.log('📋 Tabela financial_goals existe - verificando estrutura...');
      
      db.all("PRAGMA table_info(financial_goals)", [], (err, columns) => {
        if (err) {
          console.error('❌ Erro ao verificar colunas:', err);
          db.close();
          return;
        }
        
        console.log('📋 Colunas atuais:');
        columns.forEach(col => {
          console.log(`   - ${col.name} (${col.type})`);
        });
        
        const columnNames = columns.map(col => col.name);
        
        if (!columnNames.includes('name')) {
          console.log('\n⚠️  Tabela está com estrutura antiga!');
          console.log('🗑️  Dropando tabela antiga...');
          
          db.run('DROP TABLE financial_goals', (err) => {
            if (err) {
              console.error('❌ Erro ao dropar tabela:', err);
              db.close();
              return;
            }
            
            console.log('✅ Tabela antiga removida');
            console.log('🔧 Criando nova tabela...');
            
            db.run(`CREATE TABLE financial_goals (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              description TEXT,
              target_amount REAL NOT NULL,
              current_amount REAL DEFAULT 0,
              deadline DATE,
              category TEXT DEFAULT 'other',
              status TEXT DEFAULT 'active',
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
              if (err) {
                console.error('❌ Erro ao criar tabela:', err);
              } else {
                console.log('✅ Tabela financial_goals recriada com sucesso!');
              }
              db.close();
            });
          });
        } else {
          console.log('\n✅ Tabela já está com a estrutura correta!');
          db.close();
        }
      });
    } else {
      console.log('📋 Tabela financial_goals não existe - criando...');
      
      db.run(`CREATE TABLE financial_goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        target_amount REAL NOT NULL,
        current_amount REAL DEFAULT 0,
        deadline DATE,
        category TEXT DEFAULT 'other',
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Erro ao criar tabela:', err);
        } else {
          console.log('✅ Tabela financial_goals criada com sucesso!');
        }
        db.close();
      });
    }
  });
});
