const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config/secret')

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          console.log(err)
          res.status(400).json(err)
        } else {
          console.log('token confirmed: \n', decodedToken)
          req.decodedToken = decodedToken
          next();
        }
      })
    } else {
      res.status(401).json({ message: 'Unauthorized'})
    }
}