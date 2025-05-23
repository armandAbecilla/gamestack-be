const config = require('../config/config');

const fetch = require('fetch-retry')(global.fetch);
const retryOps = {
  retries: 3,
  retryDelay: 1000,
};

exports.search = async (req, res) => {
  const keyword = req.query.keyword;
  const pageSize = 5;

  try {
    const response = await fetch(
      `${config.RAWG.apiUrl}?key=${config.RAWG.apiKey}&page_size=${pageSize}&search=${keyword}`,
      retryOps
    );
    const games = await response.json();
    res.status(200).json({ games: games.results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getGameDetails = async (req, res) => {
  const id = req.params.id;

  try {
    const gameDetails = await this.fetchGameDetailsById(id);
    res.status(200).json(gameDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.fetchGameDetailsById = async (id) => {
  try {
    const response = await fetch(
      `${config.RAWG.apiUrl}/${id}?key=${config.RAWG.apiKey}`,
      retryOps
    );

    return await response.json();
  } catch (error) {
    throw new Error('unable to fetch');
  }
};
