const express = require('express');
const router = express.Router();
// controllers
const userGamesCtrl = require('../controllers/user-games-controller');

router.get('/', async (req, res) => {
  await userGamesCtrl.getUserGamesCtrl(req, res);
});

router.get('/:id', async (req, res) => {
  await userGamesCtrl.viewGameDetailCtrl(req, res);
});

router.patch('/:id', async (req, res) => {
  await userGamesCtrl.updateGameCtrl(req, res);
});

router.post('/add', async (req, res) => {
  await userGamesCtrl.addUserGameCtrl(req, res);
});

module.exports = router;
