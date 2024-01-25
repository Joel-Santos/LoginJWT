// controllers/UserController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('knex');
const AuthMiddleware = require('../middleware/authMiddleware');

const knexConfig = require('../knexfile');
const db = knex(knexConfig);

class UserController {
  static async register(req, res) {
    const { username, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db('users').insert({ username, password: hashedPassword });
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  static async renderLogin(req, res) {
    res.render('login', { error: null });
  }
//   static async renderSecureRoute(req, res) {
//     res.render('secure', {userId: req.userId });
//   }
    static async renderSecureRoute(req, res) {
        try {
            const user = await db('users').select('username').where('id', req.userId).first();
            res.render('secure', { username: user.username });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
  
  static async renderRegister(req, res) {
    res.render('register');
  }
  static async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await db('users').where({ username }).first();

      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, { httpOnly: true });
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  static async secureRoute(req, res) {
    // Rota segura que requer autenticação usando o token JWT
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      // Lógica para manipular a rota segura

      res.status(200).json({ message: 'Secure route accessed successfully' });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
  static async logout(req, res) {
    // Rota de logout, limpando o cookie
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  }
}

module.exports = UserController;

