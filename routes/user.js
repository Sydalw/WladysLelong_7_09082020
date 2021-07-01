const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const rateLimiterMiddleware = require('../middleware/rateLimiterMiddleware');
const validationUserRegex = require('../middleware/validationUserMiddleware');
const pwdValidator = require('../middleware/pwdValidatorMiddleware');
const multer = require('../middleware/multer-config');

const userCtrl = require('../controllers/user');

router.get('/users', auth, userCtrl.getAllUsers);
router.post('/login', rateLimiterMiddleware, validationUserRegex, userCtrl.login);
router.post('/signup', validationUserRegex, pwdValidator, userCtrl.signup);
router.get('/user/:id', auth, userCtrl.readProfile);
router.put('/user/:id', auth, multer, userCtrl.updateProfile);
router.delete('/user/:id', auth, userCtrl.deleteProfile);
router.put('/user/:id/role', auth, userCtrl.giveRights);
router.get('/users/roles', auth, userCtrl.getAllRoles);

module.exports = router;
