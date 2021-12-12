const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/home', auth, userCtrl.readInfo);
router.get('/:id', userCtrl.getOne);
router.put('/:id', userCtrl.update);

module.exports = router;