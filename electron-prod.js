// Forçar modo produção
process.env.NODE_ENV = 'production';

// Carregar o electron principal
require('./electron.js');
