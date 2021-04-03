const jwt = require('jsonwebtoken');
const config = require('dotenv').config();
const keyValueToken = process.env.key_value_token;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, keyValueToken);
    const decodedUserId = decodedToken.userId;
    if (req.body.id && req.body.id !== decodedUserId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
