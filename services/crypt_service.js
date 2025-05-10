const bcrypt = require('bcrypt');

exports.createSaltedHash = async (string) => {
  const saltRounds = 10;

  return await bcrypt.hash(string, saltRounds);
};
