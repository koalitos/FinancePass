const express = require('express');
const router = express.Router();
const { db } = require('../utils/database');

router.get('/', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY type, name', (err, categories) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(categories);
  });
});

router.post('/', (req, res) => {
  const { name, type, color, icon } = req.body;
  db.run('INSERT INTO categories (name, type, color, icon) VALUES (?, ?, ?, ?)', 
    [name, type, color, icon], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

module.exports = router;
