const { db, initDatabase } = require('./src/utils/database');
const UserModel = require('./src/models/userModel');

// Inicializar banco de dados
initDatabase();

// Aguardar um pouco para garantir que as tabelas foram criadas
setTimeout(() => {
  // Verificar se já existe usuário
  UserModel.count((err, result) => {
    if (err) {
      console.error('❌ Erro ao verificar usuários:', err);
      process.exit(1);
    }

    if (result.count === 0) {
      // Criar usuário padrão
      UserModel.create('admin', 'admin123', 'Administrador', (err, userId) => {
        if (err) {
          console.error('❌ Erro ao criar usuário:', err);
          process.exit(1);
        }

        console.log('✅ Usuário padrão criado com sucesso!');
        console.log('📝 Credenciais:');
        console.log('   Usuário: admin');
        console.log('   Senha: admin123');
        console.log('');
        console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
        process.exit(0);
      });
    } else {
      console.log('ℹ️  Já existem usuários cadastrados');
      process.exit(0);
    }
  });
}, 1000);
