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
    session_date: gameSessionData.sessionDate,
    duration_minutes: gameSessionData.durationInMinutes,
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
    session_date: gameSessionData.sessionDate,
    duration_minutes: gameSessionData.durationInMinutes,
    notes: gameSessionData.notes,
    updated_at: new Date().toISOString(),
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
    .order("session_date", { ascending: false })
    .order("updated_at", { ascending: false, nullsLast: true });

  if (error) {
    throw new Error(error.message);
  }

  const result = data.map((session) => ({
    id: session.id,
    userId: session.user_id,
    gameId: session.game_id,
    sessionDate: session.session_date,
    durationInMinutes: session.duration_minutes,
    notes: session.notes,
  }));

  return result;
};

exports.deleteGameSession = async (sessionId) => {
  const { error } = await supabase
    .from("game_sessions")
    .delete()
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};
