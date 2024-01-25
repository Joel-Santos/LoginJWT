// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

class AuthMiddleware {
  static authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).render('login', { error: 'Unauthorized. Please login.' });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedToken.userId;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).render('login', { error: 'Unauthorized. Please login.' });
    }
  }
}

module.exports = AuthMiddleware;
