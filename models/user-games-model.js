const config = require('../config/config.js');
const sb = require('@supabase/supabase-js');
const { startOfWeek, endOfWeek } = require('date-fns');
const query = require('../services/postgres_service.js');

const ACCEPTED_TIME_UNITS = '';

// Create a single supabase client for interacting with your database
const supabase = sb.createClient(
  config.SUPA_BASE.url,
  config.SUPA_BASE.secretKey
);

exports.getUserGames = async (
  userId,
  status = '',
  title = '',
  page = 1,
  limit = 25,
  filterByTimeUnit = undefined
) => {
  let query = supabase
    .from('UserGames')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  if (status !== '') {
    query = query.eq('status', status);
  }

  if (title !== '') {
    query = query.ilike('rawg_game_title', `%${title}%`);
  }

  if (filterByTimeUnit) {
    const now = new Date();

    if (filterByTimeUnit === 'this_week') {
      const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
      const end = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

      query.gte('updated_at', start.toISOString()); // >= date
      query.lte('updated_at', end.toDateString()); // <= date
    } else if (filterByTimeUnit === 'last_30_days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days in ms

      query.gte('updated_at', thirtyDaysAgo.toISOString());
    } else if (filterByTimeUnit === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Get start of this month
      const startOfNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      ); // Get start of next month

      query.gte('updated_at', startOfMonth.toISOString());
      query.lte('updated_at', startOfNextMonth.toDateString());
    } else if (filterByTimeUnit === 'this_year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1 of this year
      const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1); // January 1 of next year

      query.gte('updated_at', startOfYear.toISOString());
      query.lte('updated_at', startOfNextYear.toDateString());
    }
  }
  // default
  query = query.order('updated_at', { ascending: false });

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    data: data,
    count: count,
  };
};

exports.getUserGameDetails = async (gameId, userId) => {
  const { data, error } = await supabase
    .from('UserGames')
    .select('*')
    .eq('rawg_game_id', gameId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

exports.addUserGame = async (gameData) => {
  const newGame = {
    user_id: gameData.userId,
    status: gameData.status,
    notes: gameData?.notes || null,
    rawg_game_id: gameData.rawgGameId,
    rawg_game_title: gameData.rawgGameTitle,
  };

  const { data: userGameData, error: userGameError } = await supabase
    .from('UserGames')
    .insert(newGame)
    .select();

  if (userGameError) {
    throw new Error(userGameError.message);
  }

  return userGameData;
};

exports.removeFromUserGames = async (id) => {
  const { error } = await supabase.from('UserGames').delete().eq('id', id);

  if (error) {
    throw new Error(userGameError.message);
  }
};

exports.updateUserGameDetails = async (id, gameData) => {
  const updatedStatus = gameData?.status;
  const updatedNotes = gameData?.notes;
  const updatedPlatform = gameData?.platform;

  const updatedData = {
    status: updatedStatus,
    notes: updatedNotes,
    platform: updatedPlatform,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('UserGames')
    .update(updatedData)
    .eq('id', id);

  if (error) {
    throw new Error(error);
  }

  return 'Updated successfully';
};

exports.getUserStats = async (userId, timeUnit = '') => {
  const ACCEPTED_TIME_UNITS = ['last_30_days', 'this_month'];
  let queryStr = `SELECT status, COUNT(*) AS count FROM "UserGames" WHERE user_id = $1 `;
  const params = [userId]; // userId as initial params

  if (timeUnit && ACCEPTED_TIME_UNITS.includes(timeUnit)) {
    const now = new Date();
    if (timeUnit === 'last_30_days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days in ms
      queryStr += `AND updated_at >= $2`;
      params.push(thirtyDaysAgo);
    } else if (timeUnit === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      // Get start of next month
      const startOfNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );
      queryStr += `AND updated_at >= $2 AND updated_at <= $3`;
      params.push(startOfMonth, startOfNextMonth);
    }
  }

  queryStr += ` GROUP BY status`;

  const data = await query.executeQuery(queryStr, params);
  const result = data.reduce((acc, res) => {
    const key = res.status || 'uncategorized';
    acc[key] = parseInt(res.count);
    return acc;
  }, {});

  const total = data.reduce((total, res) => total + parseInt(res.count), 0);

  return {
    ...result,
    total: total,
  };
};
