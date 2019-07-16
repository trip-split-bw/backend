const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config/secret')

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    console.log('at auth')
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          res.status(400).json(err)
        } else {
          req.decodedToken = decodedToken
          console.log('at token decode')
          next()
        }
      })
    } else {
      res.status(401).json({ message: 'Unauthorized'})
    }
}