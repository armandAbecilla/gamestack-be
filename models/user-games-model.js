const config = require('../config/config.js');
const sb = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = sb.createClient(
  config.SUPA_BASE.url,
  config.SUPA_BASE.secretKey
);

exports.getUserGames = async (userId, status = '', page = 1, limit = 25) => {
  // We are now accessing a View

  let query = supabase
    .from('UserGames')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  if (status !== '') {
    query = query.eq('status', status);
  }

  query = query.order('id', { ascending: false });

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Supabase Error:', error);
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

  const updatedData = {
    status: updatedStatus,
    notes: updatedNotes,
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
