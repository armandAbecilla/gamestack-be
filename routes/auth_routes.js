const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/auth-controller');

router.post('/signup', async (req, res) => {
  await authCtrl.signUp(req, res);
});

router.post('/login', async (req, res) => {
  await authCtrl.login(req, res);
});

router.get('/user-data/:userId', async (req, res) => {
  await authCtrl.getUserData(req, res);
});

module.exports = router;
