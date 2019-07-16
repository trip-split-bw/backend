const express = require('express');
const router = express.Router();
const restricted = require('../authentication/restricted-middleware');

const Users = require('./user-model');

router.get('/api/users', restricted, async (req, res) => {
  try {
    const users = await Users.find()

    if(users) {
      res.status(200).json(users)
    } else {
      res.status(401).json({ message: 'no users found' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/api/users/:id', restricted, validateData, async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await Users.findById(id)

  res.status(200).json(user)
})

router.put('/api/users/:id', restricted, validateData, async (req, res) => {
  const id = parseInt(req.params.id);
  
  const { name, phone_number, password } = req.body;

  if(name && phone_number && password) {
    await Users.update(id, req.body);
    const user = await Users.findById(id)

    res.status(200).json(user)
  } else {
    res.status(403).json({ message: 'Invalid format' })
  }
})

router.delete('/api/users/:id', restricted, validateData, async (req, res) => {
  const id = parseInt(req.params.id);
  await Users.remove(id)

  res.status(200).json({ message: 'deleted successfully' })
})

//middleware
async function validateData(req, res, next) {
  const id = parseInt(req.params.id);

  try {
    const user = await Users.findById(id);

    if(user) {
      next()
    } else {
      res.status(403).json({ message: 'user not found' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

module.exports = router;