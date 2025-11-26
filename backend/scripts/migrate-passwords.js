const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔄 Migração de Senhas - Re-criptografia\n');
console.log('⚠️  ATENÇÃO: Este script irá DELETAR todas as senhas criptografadas antigas!\n');
console.log('📝 Motivo: A chave de criptografia mudou e não é possível descriptografar.\n');
console.log('💡 Alternativa: Você precisará cadastrar as senhas novamente.\n');

rl.question('Deseja continuar e DELETAR todas as senhas? (sim/não): ', (answer) => {
  if (answer.toLowerCase() !== 'sim') {
    console.log('\n❌ Operação cancelada.');
    rl.close();
    process.exit(0);
  }
  
  console.log('\n🗑️  Deletando senhas antigas...\n');
  
  const dbPath = path.join(__dirname, '..', 'database.sqlite');
  const db = new sqlite3.Database(dbPath);
  
  db.run('DELETE FROM passwords', function(err) {
    if (err) {
      console.error('❌ Erro ao deletar senhas:', err.message);
      rl.close();
      process.exit(1);
    }
    
    console.log(`✅ ${this.changes} senha(s) deletada(s) com sucesso!\n`);
    console.log('📝 Próximos passos:');
    console.log('1. Reinicie o backend');
    console.log('2. Cadastre suas senhas novamente');
    console.log('3. Elas serão criptografadas com a nova chave\n');
    
    db.close();
    rl.close();
  });
});
