const config = require('../config/config');
const sb = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = sb.createClient(
  config.SUPA_BASE.url,
  config.SUPA_BASE.secretKey
);

exports.createUser = async (email, password, firstName, lastName) => {
  const { data: user, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    throw new Error(error);
  }

  if (user) {
    const { data: userProfile, error } = await supabase
      .from('Profiles')
      .insert({
        id: user.user.id,
        first_name: firstName,
        last_name: lastName,
      })
      .select();

    if (error) {
      throw new Error(error);
    }

    if (userProfile) {
      return 'User successfully created!';
    }
  }
};

exports.loginUser = async (email, password) => {
  const { data: user, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    throw new Error(JSON.stringify({ ...error }));
  }

  if (user) {
    const userId = user.user.id;
    const { data: userData, error } = await supabase
      .from('Profiles')
      .select('*')
      .eq('id', userId);

    if (error) {
      throw new Error(error);
    }

    if (userData) {
      const result = {
        id: userId,
        email: user.user.email,
        first_name: userData[0].first_name,
        last_name: userData[0].last_name,
        token: user.session.access_token,
      };

      return result;
    }
  }
};

/**
 * Get the user data from Profiles Table
 * @param {string} userId - The userId from Supabase Auth.
 */
exports.getuserData = async (userId) => {
  if (!userId) throw new Error('Please provide payload');

  const { data: userData, error } = await supabase
    .from('Profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  if (userData) {
    const result = {
      firstName: userData.first_name,
      lastName: userData.last_name,
    };

    return result;
  }
};
