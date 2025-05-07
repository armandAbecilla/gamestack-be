const userGamesMdl = require('../models/user-games-model.js');

exports.getUserGamesCtrl = async (req, res, next) => {
  try {
    const page = req.query.page;
    const limit = req.query.limit;
    const searchTerm = req.query.search;

    const games = await userGamesMdl.getUserGames(searchTerm, page, limit);
    res.status(201).json(games);
  } catch (e) {
    res.json({ message: e.message || 'Could not fetch user games.' });
  }
};

exports.addUserGameCtrl = async (req, res, next) => {
  const gameData = req.body.gameData;

  if (
    gameData === null ||
    gameData.name === null ||
    gameData.platform === null ||
    gameData.status === null
  ) {
    return res.status(400).json({ message: 'Missing data.' });
  }

  try {
    const resData = await userGamesMdl.addUserGame(gameData);
    res.status(201).json({ message: 'Game has been added!', data: resData });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.viewGameDetailCtrl = async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: 'Missing data.' });
  }

  try {
    // model here
    const resData = await userGamesMdl.viewGameDetails(id);

    res.status(201).json({ message: 'Success', data: resData });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.updateGameCtrl = async (req, res, next) => {
  const id = req.params.id;
  const gameData = req.body;

  if (!id || !gameData) {
    return res.status(400).json({ message: 'Missing data.' });
  }

  try {
    await userGamesMdl.updateGame(id, gameData);
    return res.status(200).json({ message: 'Game updated successfully.' });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
