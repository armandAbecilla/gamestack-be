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
    const resData = await authMdl.loginUser(email, password);
    return res.status(200).json(resData);
  } catch (e) {
    const error = JSON.parse(e.message);

    if (error.code === 'email_not_confirmed') {
      return res.status(400).json({ message: 'User account not verified.' });
    }

    if (error.code === 'invalid_credentials') {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    return res
      .status(400)
      .json({ message: 'Something went wrong, please try again later.' });
  }
};
