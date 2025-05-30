const express = require('express');
const router = express.Router();
// controllers
const userGamesCtrl = require('../controllers/user-games-controller');

// get the specific details such as notes and status for the selected game
router.get('/:id', async (req, res) => {
  await userGamesCtrl.getUserGameDetails(req, res);
});

// remove specific game from Library
router.delete('/:id', async (req, res) => {
  await userGamesCtrl.removeFromUserGames(req, res);
});

router.patch('/:id', async (req, res) => {
  await userGamesCtrl.updateUserGameCtrl(req, res);
});

router.post('/add', async (req, res) => {
  await userGamesCtrl.addUserGameCtrl(req, res);
});

// get all user games
router.get('/user/:id', async (req, res) => {
  await userGamesCtrl.getUserGamesCtrl(req, res);
});

router.get('/user/:id/stats', async (req, res) => {
  await userGamesCtrl.getUserStatsCtrl(req, res);
});

module.exports = router;
