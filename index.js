const config = require('./config/config.js');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(cors(config.CorsOptions));

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
