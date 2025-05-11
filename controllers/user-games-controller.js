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
  const gameData = req.body;
  const userId = gameData.userId;
  const rawgGameId = gameData.rawgGameId;
  const status = gameData.status;

  if (
    gameData === null ||
    userId === null ||
    rawgGameId === null ||
    status === null
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

exports.removeFromUserGames = async (req, res) => {
  const id = req.params.id;

  if (id === null || id === undefined) {
    return res.status(400).json({ message: 'Missing data.' });
  }

  try {
    await userGamesMdl.removeFromUserGames(id);
    res.status(201).json({ message: 'Game removed from library!' });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.getUserGameDetails = async (req, res) => {
  const gameId = req.params.id;
  const userId = req.query.userId;

  if (gameId === null || userId === null) {
    return res.status(400).json({ message: 'Missing data.' });
  }

  try {
    const resData = await userGamesMdl.getUserGameDetails(gameId, userId);
    res.status(201).json(resData);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }

  console.log(gameId, userId);
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
