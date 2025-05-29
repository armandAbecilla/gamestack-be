const config = require('../config/config.js');
const sb = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = sb.createClient(
  config.SUPA_BASE.url,
  config.SUPA_BASE.secretKey
);

exports.getSBGameRecord = async (rawg_game_id) => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('external_id', rawg_game_id);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
};

exports.addSBGame = async (rawg_game_id, newData) => {
  const newRecord = {
    external_id: rawg_game_id,
    rawg_data: newData,
    last_synced_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from('games').insert(newRecord);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
};

exports.updateSBGame = async (rawg_game_id, updatedGameData) => {
  const { data, error } = await supabase
    .from('games')
    .update({
      rawg_data: updatedGameData,
      last_synced_at: new Date().toISOString(),
    })
    .eq('external_id', rawg_game_id);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
};

exports.getSBGameRecordByIds = async (ids) => {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .in('external_id', ids);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
