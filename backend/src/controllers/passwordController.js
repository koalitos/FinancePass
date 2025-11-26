const PasswordModel = require('../models/passwordModel');

exports.getAll = (req, res) => {
  PasswordModel.getAll((err, passwords) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(passwords);
  });
};

exports.getById = (req, res) => {
  console.log(`[Password] Fetching password ID: ${req.params.id}`);
  
  PasswordModel.getById(req.params.id, (err, password) => {
    if (err) {
      console.error(`[Password] Database error:`, err);
      return res.status(500).json({ error: err.message });
    }
    
    if (!password) {
      console.warn(`[Password] Password not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Password not found' });
    }
    
    console.log(`[Password] Found password, attempting decryption...`);
    
    try {
      password.password_decrypted = PasswordModel.decryptPassword(password.password_encrypted);
      console.log(`[Password] Decryption successful`);
      res.json(password);
    } catch (decryptError) {
      console.error('[Password] Decryption error:', decryptError);
      return res.status(500).json({ 
        error: 'Failed to decrypt password', 
        details: decryptError.message 
      });
    }
  });
};

exports.create = (req, res) => {
  PasswordModel.create(req.body, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, message: 'Password created successfully' });
  });
};

exports.update = (req, res) => {
  PasswordModel.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Password updated successfully' });
  });
};

exports.delete = (req, res) => {
  PasswordModel.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Password deleted successfully' });
  });
};

exports.search = (req, res) => {
  PasswordModel.search(req.query.q, (err, passwords) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(passwords);
  });
};
