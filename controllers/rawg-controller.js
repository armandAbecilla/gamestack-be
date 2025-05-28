const config = require('../config/config');
const gamesCtrl = require('./games-controller');

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
    // check if there is game detail record in Games tbl from Supabase
    const record = await gamesCtrl.getSBGameRecord(id);

    if (record.length > 0) {
      const lastSyncAt = new Date(record.last_sync_at);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      // check if last_sync_at is > 7 days
      const isOutdated = true;
      // lastSyncAt > sevenDaysAgo
      if (lastSyncAt > sevenDaysAgo) {
        const updatedDetails = await this.fetchGameDetailsById(id); // fetch updated data from RAWG
        await gamesCtrl.updateSBGame(id, updatedDetails);
        res.status(200).json(gameDetails); // return after updating
      } else {
        // return current record
        res.status(200).json(record[0].rawg_data); // return the data from DB
      }
    } else {
      // if no record in the Database
      const gameDetails = await this.fetchGameDetailsById(id); // fetch data from RAWG
      await gamesCtrl.addSBGame(id, gameDetails); // Save data to DB for re-use
      res.status(200).json(gameDetails);
    }
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
    console.log(error);
    throw new Error('unable to fetch');
  }
};
