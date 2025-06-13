const gamesSessionMdl = require("../models/game-session-model");

exports.addSession = async (req, res) => {
  const gameSessionData = req.body;

  if (!gameSessionData) {
    return res.status(400).json({ message: "Missing data." });
  }

  try {
    const data = await gamesSessionMdl.addSession(gameSessionData);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSession = async (req, res) => {
  const updatedSessionData = req.body;
  const gamesSessionId = req.params.id;

  if (!updatedSessionData || gamesSessionId) {
    return res.status(400).json({ message: "Missing data." });
  }

  try {
    const data = await gamesSessionMdl.updateSession(
      gamesSessionId,
      updatedSessionData,
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGameSession = async (req, res) => {
  const gameId = req.params.id;
  const userId = req.query.userId;

  if (!gameId || !userId) {
    return res.status(400).json({ message: "Missing data." });
  }

  try {
    const data = await gamesSessionMdl.getGameSession(gameId, userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
