const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const generateToken = require('../../config/token-service');

const Auth = require('./auth-model');

const db = require('../../data/dbConfig');

router.use(express.json(), cors());

router.post('/api/register', validateData, validateUser, async (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  try {
    const result = await Auth.register(user);

    res.status(200).json(result)
  } catch(err) {
    res.status(500).json(err)
  } 
})

router.post('/api/login', async (req, res) => {
  let { phone_number, password } = req.body;

  if(phone_number && password) {
    try {
      const user = await Auth.login(req.body)
      
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)
          
        res.status(200).json({
          message: `Welcome, ${user.name}!`,
          token,
          userId: user.id
        });
      } else {
        res.status(401).json({ message: 'invalid credentials' });
      }
    } catch (err) {
      res.status(500).json(err)
    }
  } else {
    res.status(403).json({ message: 'invalid format' })
  }
})

//middleware
function validateData(req, res, next) {
  const { name, phone_number, password } = req.body;

  if(name && phone_number && password) {
    next()
  } else {
    res.status(422).json({ message: 'invalid format' })
  }
}

async function validateUser(req, res, next) {
  const { phone_number } = req.body;
  const check = await Auth.validate(phone_number);

  if(check) {
    next();
  } else {
    res.status(403).json({ message: 'phone number already exists'});
  }  
}

module.exports = router;