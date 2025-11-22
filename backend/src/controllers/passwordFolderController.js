const PasswordFolderModel = require('../models/passwordFolderModel');

exports.getAll = (req, res) => {
  PasswordFolderModel.getAll((err, folders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(folders);
  });
};

exports.getById = (req, res) => {
  PasswordFolderModel.getById(req.params.id, (err, folder) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!folder) return res.status(404).json({ error: 'Folder not found' });
    res.json(folder);
  });
};

exports.create = (req, res) => {
  PasswordFolderModel.create(req.body, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, message: 'Folder created successfully' });
  });
};

exports.update = (req, res) => {
  PasswordFolderModel.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Folder updated successfully' });
  });
};

exports.delete = (req, res) => {
  PasswordFolderModel.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Folder deleted successfully' });
  });
};

exports.getPasswords = (req, res) => {
  PasswordFolderModel.getPasswordsByFolder(req.params.id, (err, passwords) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(passwords);
  });
};
