const { db } = require('../utils/database');

// Criar tabela de orçamentos se não existir
db.run(`CREATE TABLE IF NOT EXISTS budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  amount REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(category_id, year, month)
)`);

exports.getAll = (req, res) => {
  const sql = `
    SELECT b.*, c.name as category_name, c.color as category_color, c.icon as category_icon
    FROM budgets b
    LEFT JOIN categories c ON b.category_id = c.id
    ORDER BY b.year DESC, b.month DESC, c.name
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getByMonth = (req, res) => {
  const { year, month } = req.params;
  
  const sql = `
    SELECT b.*, c.name as category_name, c.color as category_color, c.icon as category_icon
    FROM budgets b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.year = ? AND b.month = ?
    ORDER BY c.name
  `;
  
  db.all(sql, [year, month], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { category_id, year, month, amount } = req.body;
  
  const sql = `INSERT INTO budgets (category_id, year, month, amount) VALUES (?, ?, ?, ?)`;
  
  db.run(sql, [category_id, year, month, amount], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Orçamento já existe para esta categoria neste mês' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, category_id, year, month, amount });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  
  const sql = `UPDATE budgets SET amount = ? WHERE id = ?`;
  
  db.run(sql, [amount, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Orçamento não encontrado' });
    res.json({ message: 'Orçamento atualizado' });
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM budgets WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Orçamento não encontrado' });
    res.json({ message: 'Orçamento excluído' });
  });
};

exports.getAnalysis = (req, res) => {
  const { year, month } = req.params;
  const dateFilter = `${year}-${month.padStart(2, '0')}`;
  
  const sql = `
    SELECT 
      b.id,
      b.category_id,
      b.amount as budget_amount,
      c.name as category_name,
      c.color as category_color,
      c.icon as category_icon,
      COALESCE(SUM(e.amount), 0) as spent_amount
    FROM budgets b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN expenses e ON e.category_id = b.category_id 
      AND strftime('%Y-%m', e.date) = ?
    WHERE b.year = ? AND b.month = ?
    GROUP BY b.id, b.category_id, b.amount, c.name, c.color, c.icon
    ORDER BY c.name
  `;
  
  db.all(sql, [dateFilter, year, month], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const analysis = rows.map(row => ({
      ...row,
      remaining: row.budget_amount - row.spent_amount,
      percentage: row.budget_amount > 0 ? (row.spent_amount / row.budget_amount) * 100 : 0,
      status: row.spent_amount > row.budget_amount ? 'exceeded' : 
              row.spent_amount > row.budget_amount * 0.9 ? 'warning' : 'ok'
    }));
    
    res.json(analysis);
  });
};
