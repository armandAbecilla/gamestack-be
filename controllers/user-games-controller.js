import {
  getUserGames,
  addUserGame,
  viewGameDetails,
} from '../models/user-games-model.js';

export const getUserGamesCtrl = async function (req, res, next) {
  try {
    const games = await getUserGames();
    res.status(201).json(games);
  } catch (e) {
    res.json({ message: e.message || 'Could not fetch user games.' });
  }
};

export const addUserGameCtrl = async function (req, res, next) {
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
    const resData = await addUserGame(gameData);
    res.status(201).json({ message: 'Game has been added!', data: resData });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

export const viewGameDetailCtrl = async function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: 'Missing data.' });
  }

  try {
    // model here
    const resData = await viewGameDetails(id);

    res.status(201).json({ message: 'Success', data: resData });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
