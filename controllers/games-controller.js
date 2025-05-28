const gamesMdl = require('../models/games-model');

exports.getSBGameRecord = async (rawg_game_id) => {
  try {
    const data = await gamesMdl.getSBGameRecord(rawg_game_id);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

exports.addSBGame = async (rawg_game_id, gameData) => {
  try {
    const data = await gamesMdl.addSBGame(rawg_game_id, gameData);

    return data;
  } catch (error) {
    throw new Error(error);
  }
};

exports.updateSBGame = async (rawg_game_id, gameData) => {
  try {
    const data = await gamesMdl.updateSBGame(rawg_game_id, gameData);

    return data;
  } catch (error) {
    throw new Error(error);
  }
};
