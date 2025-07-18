const userGamesMdl = require('../models/user-games-model.js');
const gamesMdl = require('../models/games-model.js');
const httpHelper = require('../services/http.js');

exports.getUserGamesCtrl = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const status = req.query.status;
    const title = req.query.title;
    const page = req.query.page;
    const limit = req.query.limit;
    const filterByTimeUnit = req.query.filterByTimeUnit;

    if (!userId) {
      return res.status(400).json({ message: 'Missing data.' });
    }

    const { data: games, count } = await userGamesMdl.getUserGames(
      userId,
      status,
      title,
      page,
      limit,
      filterByTimeUnit
    );

    const rawgGameDataPromises = games.map(async (game) => {
      const data = await gamesMdl.getSBGameRecord(game.rawg_game_id);
      // const data = await httpHelper.retryPromise(
      //   () => gamesMdl.getSBGameRecord(game.rawg_game_id),
      //   3,
      //   500
      // );

      // console.log(data);

      return {
        userGameData: game,
        ...data[0].rawg_data,
      };
    });

    try {
      const result = await Promise.all(rawgGameDataPromises);
      const gamesRes = result.map((game) => ({
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        userGameData: game.userGameData,
      }));

      const resData = {
        count: count,
        games: gamesRes,
      };

      res.status(200).json(resData);
    } catch (e) {
      res.json({ message: e.message || 'Could not fetch user games.' });
    }
  } catch (e) {
    res.json({ message: e.message || 'Could not fetch user games.' });
  }
};

exports.addUserGameCtrl = async (req, res, next) => {
  const gameData = req.body;
  const userId = gameData.userId;
  const rawgGameId = gameData.rawgGameId;
  const rawgGameTitle = gameData.rawgGameTitle;
  const status = gameData.status;

  if (
    gameData === null ||
    userId === null ||
    rawgGameId === null ||
    rawgGameTitle === null ||
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
    res.status(204).json({ message: 'Game removed from library!' });
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
    res.status(200).json(resData);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.updateUserGameCtrl = async (req, res, next) => {
  const id = req.params.id;
  const gameData = req.body;

  if (!id || !gameData) {
    return res.status(400).json({ message: 'Missing data.' });
  }

  try {
    await userGamesMdl.updateUserGameDetails(id, gameData);
    return res.status(200).json({ message: 'Game updated successfully.' });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.getUserStatsCtrl = async (req, res) => {
  const id = req.params.id; // user id

  const resData = {
    user: id,
    all: await userGamesMdl.getUserStats(id),
    last_30_days: await userGamesMdl.getUserStats(id, 'last_30_days'),
  };

  res.status(200).json(resData);
  if (!id) {
    return res.status(400).json({ message: 'Missing Data' });
  }
};
