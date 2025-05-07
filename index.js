const config = require('./config/config.js');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// controllers
const userGamesCtrl = require('./controllers/user-games-controller.js');

app.get('/games', async (req, res) => {
  await userGamesCtrl.getUserGamesCtrl(req, res);
});

app.get('/games/:id', async (req, res) => {
  await userGamesCtrl.viewGameDetailCtrl(req, res);
});

app.patch('/games/:id', async (req, res) => {
  console.log('PATCH');
  await userGamesCtrl.updateGameCtrl(req, res);
});

app.post('/games/add', async (req, res) => {
  await userGamesCtrl.addUserGameCtrl(req, res);
});

app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: 'Not found' });
});

app.listen(config.EnvSettings.Port, () => {
  console.log(`Express server running at port ${config.EnvSettings.Port}`);
});
