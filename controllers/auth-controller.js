const config = require('../config/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authMdl = require('../models/auth-model');
const cryptService = require('../services/crypt_service');

exports.signUp = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  if (!email || email.trim() === '' || !password || password.trim() === '') {
    return res.status(400).json({ message: 'Missing data' });
  }

  try {
    const resData = await authMdl.createUser(
      email,
      password,
      firstName,
      lastName
    );

    return res.status(200).json(resData);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || email.trim() === '' || !password || password.trim() === '') {
    return res.status(400).json({ message: 'Missing data' });
  }

  try {
    const res = await authMdl.loginUser(email, password);

    // if there is existing user
    if (res.status === 400) {
      return res.status(400).json({ message: e.message });
    }

    return res.data;
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};
