const config = require('../config/config.js');
const sb = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = sb.createClient(
  config.SUPA_BASE.url,
  config.SUPA_BASE.secretKey
);

exports.getUserGames = async (searchTerm = '', page = 1, limit = 25) => {
  console.log(searchTerm, page, limit);
  // We are now accessing a View

  let query = supabase
    .from('UserGamesWithDetails')
    .select('*', { count: 'exact' })
    .order('id', { ascending: false });

  if (searchTerm !== '') {
    query = query.ilike('details_name', `%${searchTerm}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error('Supabase Error:', error); // Log it
    throw new Error(error.message);
  }

  const games = data.map((i) => ({
    id: i.id,
    platform: i.platform,
    status: i.status,
    notes: i.notes,
    details: {
      name: i.details_name,
      background_image: i.background_image,
    },
  }));

  const fetchedData = {
    count: count,
    data: games,
  };

  return fetchedData;
};

exports.addUserGame = async (gameData) => {
  const rawgDbRes = await fetch(
    `https://api.rawg.io/api/games?key=${config.RAWG.apiKey}&page_size=1&search=${gameData.name}`
  );
  const rawgDbResData = await rawgDbRes.json();

  if (!rawgDbResData?.results?.length) {
    throw new Error('Game not found.');
  }

  try {
    const newGame = {
      platform: gameData.platform,
      status: gameData.status,
      notes: gameData?.notes || null,
    };

    const { data: userGameData, error: userGameError } = await supabase
      .from('UserGames')
      .insert(newGame)
      .select();

    if (userGameError) {
      throw new Error(userGameError.message);
    }

    const gameDetails = {
      user_game_id: userGameData[0].id,
      platform_id: rawgDbResData.results[0].id,
      name: rawgDbResData.results[0].name,
      background_image: rawgDbResData.results[0].background_image,
    };

    const { data: userGamesMappingData, error: userGameMappingError } =
      await supabase.from('UserGamesMapping').insert(gameDetails).select();

    if (userGameMappingError) {
      throw new Error(userGameMappingError.message);
    }

    const insertedDetails = userGameData[0];
    const insertedGameDetails = userGamesMappingData[0];

    const createdData = {
      id: insertedDetails.id,
      platform: insertedDetails.platform,
      notes: insertedDetails.notes,
      status: insertedDetails.status,
      details: {
        id: insertedGameDetails.id,
        name: insertedGameDetails.name,
        background_image: insertedGameDetails.background_image,
      },
    };

    return createdData;
  } catch (error) {
    throw new Error(error);
  }
};

exports.viewGameDetails = async (id) => {
  const { data, error } = await supabase
    .from('UserGames')
    .select(`*, details:UserGamesMapping(*)`)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  data.details = data.details[0];

  // fetch other information from RAWG

  try {
    const response = await fetch(
      `https://api.rawg.io/api/games/${data.details?.platform_id}?key=${config.RAWG.apiKey}`
    );
    const resData = await response.json();

    // append the description
    data.description = resData.description;
  } catch (e) {
    throw new Error(e.message);
  }

  return data;
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
