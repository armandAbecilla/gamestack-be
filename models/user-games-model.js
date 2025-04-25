import { createClient } from '@supabase/supabase-js';
import { SUPA_BASE, RAWG } from '../config/config.js';

// Create a single supabase client for interacting with your database
const supabase = createClient(SUPA_BASE.url, SUPA_BASE.secretKey);

export const getUserGames = async function () {
  const { data, error } = await supabase
    .from('UserGames')
    .select(`*, details:UserGamesMapping(*)`)
    .order('id', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const games = data.map((i) => ({
    id: i.id,
    platform: i.platform,
    status: i.status,
    notes: i.notes,
    details: i.details[0],
  }));

  return games;
};

export const addUserGame = async function (gameData) {
  const rawgDbRes = await fetch(
    `https://api.rawg.io/api/games?key=${RAWG.apiKey}&page_size=1&search=${gameData.name}`,
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

export const viewGameDetails = async function (id) {
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
      `https://api.rawg.io/api/games/${data.details?.platform_id}?key=${RAWG.apiKey}`,
    );
    const resData = await response.json();

    // append the description
    data.description = resData.description;
  } catch (e) {
    throw new Error(e.message);
  }

  return data;
};
