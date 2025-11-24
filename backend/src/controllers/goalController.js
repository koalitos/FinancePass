const { db } = require('../utils/database');

// Criar tabela de metas se não existir
db.run(`CREATE TABLE IF NOT EXISTS financial_goals (
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
)`);

exports.getAll = (req, res) => {
  const sql = `SELECT * FROM financial_goals ORDER BY deadline ASC, created_at DESC`;
  
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const goals = rows.map(goal => ({
      ...goal,
      progress: goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0,
      remaining: goal.target_amount - goal.current_amount,
      daysRemaining: goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null
    }));
    
    res.json(goals);
  });
};

exports.getById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM financial_goals WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Meta não encontrada' });
    
    const goal = {
      ...row,
      progress: row.target_amount > 0 ? (row.current_amount / row.target_amount) * 100 : 0,
      remaining: row.target_amount - row.current_amount,
      daysRemaining: row.deadline ? Math.ceil((new Date(row.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null
    };
    
    res.json(goal);
  });
};

exports.create = (req, res) => {
  const { name, description, target_amount, current_amount, deadline, category } = req.body;
  
  const sql = `
    INSERT INTO financial_goals (name, description, target_amount, current_amount, deadline, category)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [name, description, target_amount, current_amount || 0, deadline, category || 'other'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, description, target_amount, current_amount: current_amount || 0, deadline, category });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { name, description, target_amount, current_amount, deadline, category, status } = req.body;
  
  const sql = `
    UPDATE financial_goals 
    SET name = ?, description = ?, target_amount = ?, current_amount = ?, 
        deadline = ?, category = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(sql, [name, description, target_amount, current_amount, deadline, category, status, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Meta não encontrada' });
    res.json({ message: 'Meta atualizada' });
  });
};

exports.updateProgress = (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  
  const sql = `
    UPDATE financial_goals 
    SET current_amount = current_amount + ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.run(sql, [amount, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Meta não encontrada' });
    
    // Verificar se a meta foi atingida
    db.get('SELECT * FROM financial_goals WHERE id = ?', [id], (err, goal) => {
      if (goal && goal.current_amount >= goal.target_amount && goal.status === 'active') {
        db.run('UPDATE financial_goals SET status = ? WHERE id = ?', ['completed', id]);
      }
    });
    
    res.json({ message: 'Progresso atualizado' });
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM financial_goals WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Meta não encontrada' });
    res.json({ message: 'Meta excluída' });
  });
};
