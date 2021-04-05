var Model = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('dotenv').config();
const keyValueToken = process.env.key_value_token;

module.exports = (req, res, next) => {
  try {
    console.log(req.params.postId);
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, keyValueToken);
    const decodedUserId = decodedToken.userId;
    console.log(decodedUserId);
    Model.User.findOne({where: { id: req.body.id}})
      .then(User => {
        console.log(User.roleId);
        if (req.body.id && req.body.id != decodedUserId && User.roleId < 2) {
          throw 'You dont have rights';
        } else {
          res.locals.roleID = User.roleId;
          next();
        }
      })
      .catch(error => res.status(501).json({ error }));
    }
  catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
