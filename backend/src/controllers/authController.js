const UserModel = require('../models/userModel');

class AuthController {
  static login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password são obrigatórios' });
    }

    UserModel.authenticate(username, password, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          name: user.name
        }
      });
    });
  }

  static register(req, res) {
    const { username, password, name } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username e password são obrigatórios' });
    }

    // Verificar se usuário já existe
    UserModel.findByUsername(username, (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }

      // Criar novo usuário
      UserModel.create(username, password, name, (err, userId) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
          success: true,
          message: 'Usuário criado com sucesso',
          userId
        });
      });
    });
  }

  static checkFirstAccess(req, res) {
    UserModel.count((err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        isFirstAccess: result.count === 0
      });
    });
  }
}

module.exports = AuthController;
