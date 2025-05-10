const config = require('../config/config');
const jwt = require('jsonwebtoken');

// middleware for securinng routes
exports.verifyToken = (req, res, next) => {
  // Do not proceed if no Authorizatoin: 'Bearer ' + token in request headers
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }

  let token = req.headers.authorization.split(' ')[1];

  if (!token || token === 'null') {
    return res.status(403).send('Unauthorized request');
  }

  try {
    let payload = jwt.verify(token, config.JWT.SecretKey);

    req.user = payload.id;
    next();
  } catch (e) {
    return res.status(403).send('Invalid or expried token');
  }
};
