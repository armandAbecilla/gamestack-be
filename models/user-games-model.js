const config = require('../config/config.js');
const sb = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = sb.createClient(
  config.SUPA_BASE.url,
  config.SUPA_BASE.secretKey
);

exports.getUserGames = async (searchTerm = '', page = 1, limit = 25) => {
  // console.log(searchTerm, page, limit);
  // // We are now accessing a View

  // let query = supabase
  //   .from('UserGamesWithDetails')
  //   .select('*', { count: 'exact' })
  //   .order('id', { ascending: false });

  // if (searchTerm !== '') {
  //   query = query.ilike('details_name', `%${searchTerm}%`);
  // }

  // query = query.range((page - 1) * limit, page * limit - 1);

  // const { data, count, error } = await query;

  // if (error) {
  //   console.error('Supabase Error:', error); // Log it
  //   throw new Error(error.message);
  // }

  // const games = data.map((i) => ({
  //   id: i.id,
  //   platform: i.platform,
  //   status: i.status,
  //   notes: i.notes,
  //   details: {
  //     name: i.details_name,
  //     background_image: i.background_image,
  //   },
  // }));

  // const fetchedData = {
  //   count: count,
  //   data: games,
  // };

  const fetchedData = {
    count: 0,
    data: [],
  };

  return fetchedData;
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

exports.updateGame = async (id, gameData) => {
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
