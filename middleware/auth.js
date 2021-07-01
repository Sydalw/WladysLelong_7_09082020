var Model = require('../lib/models/user');
const jwt = require('jsonwebtoken');
const config = require('dotenv').config();
const keyValueToken = process.env.key_value_token;

var db = require('../lib/models/index.js');

// module.exports = (req, res, next) => {
//   try {
//     //console.log(req.params.postId);
//     const token = req.headers.authorization.split(' ')[1];
//     const decodedToken = jwt.verify(token, keyValueToken);
//     const decodedUserId = decodedToken.userId;
//     console.log(decodedUserId);
//     db.User.findOne({where: { id: req.body.id}})
//       .then(User => {
//         console.log(User.roleId);
//         if (req.body.id && req.body.id != decodedUserId) {
//           throw 'You dont have rights';
//         } else {
//           res.locals.roleID = User.roleId;
//           next();
//         }
//       })
//       .catch(error => res.status(501).json({ error }));
//     }
//   catch {
//     res.status(401).json({
//       error: new Error('Invalid request!')
//     });
//   }
// };


module.exports = (req, res, next) => {
  try {
    //console.log(req.params.postId);
    const token = (req.headers.authorization.split(' ')[1]).split(':')[1];
    const incomingId = (req.headers.authorization.split(' ')[1]).split(':')[0];
    console.log("id: "+incomingId+ " token: " +token) ;
    const decodedToken = jwt.verify(token, keyValueToken);
    const decodedUserId = decodedToken.userId;
    console.log(decodedUserId);
    db.User.findOne({where: { id: incomingId}})
      .then(User => {
        console.log(User.roleId);
        if (incomingId && incomingId != decodedUserId) {
          throw 'You dont have rights';
        } else {
          res.locals.roleID = User.roleId;
          console.log("next auth")
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