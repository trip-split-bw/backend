const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./secret.js');

module.exports = (user) => {
  const payload = {
    subject: user.id,
    username: user.phone_number,
    roles: ['user']
  };

  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, jwtSecret, options);
}