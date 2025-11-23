const WebSocket = require('ws');
const crypto = require('crypto');
const os = require('os');

class SyncServer {
  constructor(port = 5175) {
    this.port = port;
    this.wss = null;
    this.token = this.generateToken();
    this.connections = new Map();
    this.persistentDevices = new Map(); // Dispositivos autorizados permanentemente
    this.tokenExpiry = Date.now() + (5 * 60 * 1000); // 5 minutos
    this.autoRenewTimer = null;
    this.cachedIP = null; // Cache do IP local
    this.startAutoRenew();
  }

  start() {
    this.wss = new WebSocket.Server({ port: this.port });
    
    this.wss.on('connection', (ws, req) => {
      console.log('📱 Nova tentativa de conexão');
      this.handleConnection(ws, req);
    });

    console.log(`🔄 Servidor de Sincronização rodando na porta ${this.port}`);
    console.log(`🔐 Token: ${this.token}`);
  }

  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  regenerateToken() {
    this.token = this.generateToken();
    this.tokenExpiry = Date.now() + (5 * 60 * 1000);
    console.log(`🔄 Novo token gerado: ${this.token}`);
    console.log(`⏰ Token expira em 5 minutos`);
  }

  startAutoRenew() {
    // Renovar token automaticamente a cada 4 minutos (antes de expirar)
    this.autoRenewTimer = setInterval(() => {
      this.regenerateToken();
    }, 4 * 60 * 1000);
    console.log('⏰ Auto-renovação de token ativada (a cada 4 minutos)');
  }

  stopAutoRenew() {
    if (this.autoRenewTimer) {
      clearInterval(this.autoRenewTimer);
      this.autoRenewTimer = null;
    }
  }

  isTokenValid() {
    return Date.now() < this.tokenExpiry;
  }

  getConnectionInfo() {
    if (!this.isTokenValid()) {
      this.regenerateToken();
    }

    return {
      ip: this.getLocalIP(),
      port: this.port,
      token: this.token,
      expiresIn: Math.floor((this.tokenExpiry - Date.now()) / 1000)
    };
  }

  getLocalIP() {
    // Usar cache se já foi detectado
    if (this.cachedIP) {
      return this.cachedIP;
    }

    const interfaces = os.networkInterfaces();
    const addresses = [];
    
    // Coletar todos os IPs IPv4 não internos
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          addresses.push(iface.address);
        }
      }
    }
    
    // Priorizar IPs que começam com 192.168 (rede local comum)
    const localIP = addresses.find(ip => ip.startsWith('192.168.')) || addresses[0];
    
    if (localIP) {
      console.log(`📡 IP Local detectado: ${localIP}`);
      this.cachedIP = localIP; // Salvar no cache
      return localIP;
    }
    
    console.warn('⚠️ Nenhum IP local encontrado! Usando localhost');
    this.cachedIP = '127.0.0.1';
    return '127.0.0.1';
  }

  handleConnection(ws, req) {
    let deviceId = null;

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('📨 Mensagem recebida:', data.type);

        switch (data.type) {
          case 'auth':
            deviceId = this.authenticate(ws, data.token, data.persistentId);
            break;
          case 'sync_request':
            this.handleSyncRequest(ws, deviceId, data);
            break;
          case 'sync_push':
            this.handleSyncPush(ws, deviceId, data);
            break;
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
          default:
            console.log('⚠️ Tipo de mensagem desconhecido:', data.type);
        }
      } catch (error) {
        console.error('❌ Erro ao processar mensagem:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: error.message 
        }));
      }
    });

    ws.on('close', () => {
      if (deviceId) {
        this.connections.delete(deviceId);
        console.log(`📱 Dispositivo desconectado: ${deviceId}`);
      }
    });

    ws.on('error', (error) => {
      console.error('❌ Erro no WebSocket:', error);
    });
  }

  authenticate(ws, token, persistentId = null) {
    // Verificar se é um dispositivo persistente tentando reconectar
    if (persistentId && this.persistentDevices.has(persistentId)) {
      const deviceInfo = this.persistentDevices.get(persistentId);
      
      this.connections.set(persistentId, {
        ws,
        connectedAt: new Date(),
        lastSync: deviceInfo.lastSync,
        persistent: true
      });

      ws.send(JSON.stringify({ 
        type: 'auth_success', 
        deviceId: persistentId,
        message: 'Reconectado automaticamente!',
        persistent: true
      }));

      console.log(`🔄 Dispositivo persistente reconectado: ${persistentId}`);
      return persistentId;
    }

    // Nova autenticação com token
    if (!this.isTokenValid()) {
      ws.send(JSON.stringify({ 
        type: 'auth_failed',
        reason: 'Token expirado. Gere um novo QR Code.'
      }));
      ws.close();
      return null;
    }

    if (token === this.token) {
      const deviceId = crypto.randomBytes(16).toString('hex');
      
      // Salvar como dispositivo persistente
      this.persistentDevices.set(deviceId, {
        authorizedAt: new Date(),
        lastSync: null
      });

      this.connections.set(deviceId, {
        ws,
        connectedAt: new Date(),
        lastSync: null,
        persistent: true
      });

      ws.send(JSON.stringify({ 
        type: 'auth_success', 
        deviceId,
        message: 'Conectado com sucesso! Seu dispositivo foi autorizado permanentemente.',
        persistent: true
      }));

      console.log(`✅ Novo dispositivo autenticado e salvo: ${deviceId}`);
      return deviceId;
    } else {
      ws.send(JSON.stringify({ 
        type: 'auth_failed',
        reason: 'Token inválido'
      }));
      ws.close();
      return null;
    }
  }

  handleSyncRequest(ws, deviceId, data) {
    if (!deviceId) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Não autenticado' 
      }));
      return;
    }

    // Buscar dados reais do banco
    const { db } = require('../utils/database');
    
    const queries = {
      expenses: 'SELECT * FROM expenses ORDER BY date DESC',
      incomes: 'SELECT * FROM incomes ORDER BY date DESC',
      debts: 'SELECT * FROM debts ORDER BY created_at DESC',
      people: 'SELECT * FROM people ORDER BY name ASC',
      passwords: 'SELECT id, title, username, email, url, notes, category, favorite, created_at, updated_at FROM passwords ORDER BY title ASC'
    };

    const results = {};
    let completed = 0;
    const total = Object.keys(queries).length;

    Object.entries(queries).forEach(([key, query]) => {
      db.all(query, (err, rows) => {
        if (err) {
          console.error(`Erro ao buscar ${key}:`, err);
          results[key] = [];
        } else {
          results[key] = rows || [];
        }
        
        completed++;
        
        if (completed === total) {
          const syncData = {
            type: 'sync_data',
            timestamp: new Date().toISOString(),
            data: results
          };

          ws.send(JSON.stringify(syncData));
          
          const connection = this.connections.get(deviceId);
          if (connection) {
            connection.lastSync = new Date();
          }

          console.log(`🔄 Dados enviados para: ${deviceId}`);
          console.log(`📊 Estatísticas: ${results.expenses.length} despesas, ${results.incomes.length} receitas, ${results.debts.length} dívidas, ${results.people.length} pessoas, ${results.passwords.length} senhas`);
        }
      });
    });
  }

  handleSyncPush(ws, deviceId, data) {
    if (!deviceId) {
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Não autenticado' 
      }));
      return;
    }

    console.log(`📥 Recebendo dados de: ${deviceId}`);
    
    const { db } = require('../utils/database');
    const changes = data.changes || {};
    let processed = 0;
    let errors = 0;
    let skipped = 0;

    // Processar despesas com merge inteligente
    if (changes.expenses && changes.expenses.length > 0) {
      console.log(`📊 Processando ${changes.expenses.length} despesas do mobile`);
      changes.expenses.forEach(expense => {
        // Verificar se já existe
        db.get('SELECT created_at FROM expenses WHERE id = ?', [expense.id], (err, existing) => {
          if (err) {
            console.error('Erro ao verificar despesa:', err);
            errors++;
            return;
          }

          // Se não existe ou o do mobile é mais recente, salvar
          if (!existing || new Date(expense.created_at) >= new Date(existing.created_at)) {
            const sql = `INSERT OR REPLACE INTO expenses 
              (id, description, amount, category_id, payment_method, date, is_recurring, recurrence_type, person_id, is_paid_back, paid_back_date, notes, installment_id, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
              expense.id, expense.description, expense.amount, expense.category_id,
              expense.payment_method, expense.date, expense.is_recurring || 0, expense.recurrence_type,
              expense.person_id, expense.is_paid_back || 0, expense.paid_back_date, expense.notes,
              expense.installment_id, expense.created_at
            ], (err) => {
              if (err) {
                console.error('Erro ao salvar despesa:', err);
                errors++;
              } else {
                processed++;
                console.log(`✅ Despesa salva: ${expense.description}`);
              }
            });
          } else {
            skipped++;
            console.log(`⏭️ Despesa ignorada (versão mais antiga): ${expense.description}`);
          }
        });
      });
    }

    // Processar receitas com merge inteligente
    if (changes.incomes && changes.incomes.length > 0) {
      console.log(`📊 Processando ${changes.incomes.length} receitas do mobile`);
      changes.incomes.forEach(income => {
        db.get('SELECT created_at FROM incomes WHERE id = ?', [income.id], (err, existing) => {
          if (err) {
            console.error('Erro ao verificar receita:', err);
            errors++;
            return;
          }

          if (!existing || new Date(income.created_at) >= new Date(existing.created_at)) {
            const sql = `INSERT OR REPLACE INTO incomes 
              (id, description, amount, category_id, source, date, is_recurring, recurrence_type, notes, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
              income.id, income.description, income.amount, income.category_id,
              income.source, income.date, income.is_recurring || 0, income.recurrence_type,
              income.notes, income.created_at
            ], (err) => {
              if (err) {
                console.error('Erro ao salvar receita:', err);
                errors++;
              } else {
                processed++;
                console.log(`✅ Receita salva: ${income.description}`);
              }
            });
          } else {
            skipped++;
          }
        });
      });
    }

    // Processar pessoas com merge inteligente
    if (changes.people && changes.people.length > 0) {
      console.log(`📊 Processando ${changes.people.length} pessoas do mobile`);
      changes.people.forEach(person => {
        db.get('SELECT created_at FROM people WHERE id = ?', [person.id], (err, existing) => {
          if (err) {
            console.error('Erro ao verificar pessoa:', err);
            errors++;
            return;
          }

          if (!existing || new Date(person.created_at) >= new Date(existing.created_at)) {
            const sql = `INSERT OR REPLACE INTO people 
              (id, name, relationship, phone, email, notes, avatar_color, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
              person.id, person.name, person.relationship, person.phone,
              person.email, person.notes, person.avatar_color, person.created_at
            ], (err) => {
              if (err) {
                console.error('Erro ao salvar pessoa:', err);
                errors++;
              } else {
                processed++;
                console.log(`✅ Pessoa salva: ${person.name}`);
              }
            });
          } else {
            skipped++;
          }
        });
      });
    }

    // Processar dívidas com merge inteligente
    if (changes.debts && changes.debts.length > 0) {
      console.log(`📊 Processando ${changes.debts.length} dívidas do mobile`);
      changes.debts.forEach(debt => {
        db.get('SELECT created_at FROM debts WHERE id = ?', [debt.id], (err, existing) => {
          if (err) {
            console.error('Erro ao verificar dívida:', err);
            errors++;
            return;
          }

          if (!existing || new Date(debt.created_at) >= new Date(existing.created_at)) {
            const sql = `INSERT OR REPLACE INTO debts 
              (id, person_id, description, total_amount, paid_amount, type, due_date, status, notes, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [
              debt.id, debt.person_id, debt.description, debt.total_amount,
              debt.paid_amount, debt.type, debt.due_date, debt.status,
              debt.notes, debt.created_at
            ], (err) => {
              if (err) {
                console.error('Erro ao salvar dívida:', err);
                errors++;
              } else {
                processed++;
                console.log(`✅ Dívida salva: ${debt.description}`);
              }
            });
          } else {
            skipped++;
          }
        });
      });
    }

    setTimeout(() => {
      const message = `Sincronização concluída! ${processed} novos/atualizados, ${skipped} ignorados${errors > 0 ? `, ${errors} erros` : ''}.`;
      
      ws.send(JSON.stringify({ 
        type: 'sync_success',
        message: message,
        stats: {
          processed,
          skipped,
          errors
        }
      }));
      
      console.log(`✅ ${message}`);
      
      // Após salvar dados do mobile, enviar dados atualizados de volta
      this.handleSyncRequest(ws, deviceId, {});
    }, 1000);
  }

  getConnectedDevices() {
    return Array.from(this.connections.entries()).map(([id, conn]) => ({
      deviceId: id,
      connectedAt: conn.connectedAt,
      lastSync: conn.lastSync
    }));
  }

  disconnectDevice(deviceId) {
    const connection = this.connections.get(deviceId);
    if (connection) {
      connection.ws.close();
      this.connections.delete(deviceId);
      // Remover também da lista persistente
      this.persistentDevices.delete(deviceId);
      console.log(`🗑️ Dispositivo removido permanentemente: ${deviceId}`);
      return true;
    }
    return false;
  }

  stop() {
    this.stopAutoRenew();
    if (this.wss) {
      this.wss.close();
    }
    console.log('🛑 Servidor de sincronização parado');
  }
}

module.exports = SyncServer;
