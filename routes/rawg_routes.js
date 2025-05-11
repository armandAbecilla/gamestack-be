const express = require('express');
const router = express.Router();

const rawgCtrl = require('../controllers/rawg-controller');

router.get('/search', async (req, res) => {
  await rawgCtrl.search(req, res);
});

router.get('/:id', async (req, res) => {
  await rawgCtrl.getGameDetails(req, res);
});

module.exports = router;
