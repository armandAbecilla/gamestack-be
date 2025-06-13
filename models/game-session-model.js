const config = require("../config/config.js");
const sb = require("@supabase/supabase-js");

// Create a single supabase client for interacting with your database
const supabase = sb.createClient(
  config.SUPA_BASE.url,
  config.SUPA_BASE.secretKey,
);

exports.addSession = async (gameSessionData) => {
  const newSession = {
    user_id: gameSessionData.userId,
    game_id: gameSessionData.gameId,
    session_date: gameSessionData.date,
    duration_minutes: gameSessionData.duration,
    notes: gameSessionData.notes,
  };

  const { error } = await supabase.from("game_sessions").insert(newSession);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

exports.updateSession = async (id, gameSessionData) => {
  const updateSession = {
    session_date: gameSessionData.date,
    duration_minutes: gameSessionData.duration,
    notes: gameSessionData.notes,
  };

  const { error } = await supabase
    .from("game_sessions")
    .update(updateSession)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

exports.getGameSession = async (gameId, userId) => {
  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("user_id", userId)
    .eq("game_id", gameId)
    .order("session_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
