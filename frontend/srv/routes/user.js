const express = require('express');
const router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload',
    algorithms: ['RS256']
  });

const userCtrl = require('../controllers/user');
const infoCtrl = require('../controllers/info');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/info', auth, infoCtrl.readInfo);
router.get('/:id', userCtrl.getOne);
router.put('/:id', userCtrl.update);

module.exports = router;