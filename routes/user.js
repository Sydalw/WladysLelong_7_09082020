const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userCtrl = require('../controllers/user');

router.get('/users', auth, userCtrl.getAllUsers);
router.post('/login', userCtrl.login);
router.post('/signup', userCtrl.signup);
router.get('/profile', auth, userCtrl.readProfile);
router.post('/profile/update', auth, userCtrl.updateProfile);
router.delete('/profile/delete', auth, userCtrl.deleteProfile);

module.exports = router;
