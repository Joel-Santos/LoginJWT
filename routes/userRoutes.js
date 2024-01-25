// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const AuthMiddleware = require('../middleware/authMiddleware');

// Rota para renderizar o formulário de registro
router.get('/register', UserController.renderRegister);
router.post('/register', UserController.register);

// Rota para renderizar o formulário de login
router.get('/login', UserController.renderLogin);
router.post('/login', UserController.login);

// Rota segura (requer autenticação)
router.get('/secure', AuthMiddleware.authenticateToken, UserController.renderSecureRoute);

// Rota de logout
router.get('/logout', UserController.logout);

module.exports = router;
