const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Aplicando migration: add-goals-columns');
console.log('📁 Banco de dados:', dbPath);

db.serialize(() => {
  // Verificar estrutura atual
  db.all("PRAGMA table_info(financial_goals)", [], (err, columns) => {
    if (err) {
      console.error('❌ Erro ao verificar tabela:', err);
      db.close();
      return;
    }
    
    if (!columns || columns.length === 0) {
      console.log('⚠️  Tabela financial_goals não existe ainda');
      db.close();
      return;
    }
    
    const columnNames = columns.map(col => col.name);
    console.log('📋 Colunas atuais:', columnNames.join(', '));
    
    let migrationsApplied = 0;
    
    // Adicionar coluna 'name' se não existir
    if (!columnNames.includes('name')) {
      console.log('🔧 Adicionando coluna "name"...');
      db.run('ALTER TABLE financial_goals ADD COLUMN name TEXT', (err) => {
        if (err) console.error('❌ Erro ao adicionar coluna name:', err);
        else {
          console.log('✅ Coluna "name" adicionada');
          migrationsApplied++;
        }
      });
    }
    
    // Adicionar coluna 'description' se não existir
    if (!columnNames.includes('description')) {
      console.log('🔧 Adicionando coluna "description"...');
      db.run('ALTER TABLE financial_goals ADD COLUMN description TEXT', (err) => {
        if (err) console.error('❌ Erro ao adicionar coluna description:', err);
        else {
          console.log('✅ Coluna "description" adicionada');
          migrationsApplied++;
        }
      });
    }
    
    // Adicionar coluna 'category' se não existir
    if (!columnNames.includes('category')) {
      console.log('🔧 Adicionando coluna "category"...');
      db.run('ALTER TABLE financial_goals ADD COLUMN category TEXT DEFAULT "other"', (err) => {
        if (err) console.error('❌ Erro ao adicionar coluna category:', err);
        else {
          console.log('✅ Coluna "category" adicionada');
          migrationsApplied++;
        }
      });
    }
    
    // Adicionar coluna 'status' se não existir
    if (!columnNames.includes('status')) {
      console.log('🔧 Adicionando coluna "status"...');
      db.run('ALTER TABLE financial_goals ADD COLUMN status TEXT DEFAULT "active"', (err) => {
        if (err) console.error('❌ Erro ao adicionar coluna status:', err);
        else {
          console.log('✅ Coluna "status" adicionada');
          migrationsApplied++;
        }
      });
    }
    
    // Aguardar um pouco e fechar
    setTimeout(() => {
      if (migrationsApplied === 0) {
        console.log('✅ Nenhuma migration necessária - tabela já está atualizada');
      } else {
        console.log(`✅ ${migrationsApplied} migration(s) aplicada(s) com sucesso!`);
      }
      db.close();
    }, 1000);
  });
});
