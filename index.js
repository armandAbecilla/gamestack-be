import config from './config/config.js';
import bodyParser from 'body-parser';
import express from 'express';
// setup controllers below
import {
  getUserGamesCtrl,
  addUserGameCtrl,
  viewGameDetailCtrl,
  updateGameCtrl,
} from './controllers/user-games-controller.js';

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

app.get('/games', async (req, res) => {
  await getUserGamesCtrl(req, res);
});

app.get('/games/:id', async (req, res) => {
  await viewGameDetailCtrl(req, res);
});

app.patch('/games/:id', async (req, res) => {
  console.log('PATCH');
  await updateGameCtrl(req, res);
});

app.post('/games/add', async (req, res) => {
  await addUserGameCtrl(req, res);
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
