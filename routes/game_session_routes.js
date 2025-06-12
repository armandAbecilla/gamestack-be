const express = require('express');
const router = express.Router();
const gamesSessionCtrl = require('../controllers/game-session-controller');

router.post('/add', async (req, res) => {
  await gamesSessionCtrl.addSession(req, res);
});

router.get('/:id', async (req, res) => {
  await gamesSessionCtrl.getGameSession(req, res);
});

module.exports = router;
