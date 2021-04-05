const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userCtrl = require('../controllers/user');

router.get('/profiles', auth, userCtrl.getAllUsers);
router.post('/login', userCtrl.login);
router.post('/signup', userCtrl.signup);
router.get('/profile/:id', auth, userCtrl.readProfile);
router.put('/profile/:id', auth, userCtrl.updateProfile);
router.delete('/profile/:id', auth, userCtrl.deleteProfile);

module.exports = router;
