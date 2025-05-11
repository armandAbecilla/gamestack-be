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

// routes
const authRoutes = require('./routes/auth_routes.js');
const gamesRoutes = require('./routes/games_routes.js');
const rawgRoutes = require('./routes/rawg_routes.js');

app.use('/auth', authRoutes);
app.use('/games', gamesRoutes);
app.use('/rawg', rawgRoutes);

app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: 'Not found' });
});

app.listen(config.EnvSettings.Port, () => {
  console.log(`Express server running at port ${config.EnvSettings.Port}`);
});
