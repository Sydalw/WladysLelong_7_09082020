const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userCtrl = require('../controllers/user');

router.post('/users', auth, userCtrl.getAllUsers);
router.post('/login', userCtrl.login);
router.post('/signup', userCtrl.signup);
router.post('/user/:id', auth, userCtrl.readProfile);
router.put('/user/:id', auth, userCtrl.updateProfile);
router.delete('/user/:id', auth, userCtrl.deleteProfile);
router.put('/user/:id/role', auth, userCtrl.giveRights);
router.post('/users/roles', auth, userCtrl.getAllRoles);

module.exports = router;
