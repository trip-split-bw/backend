const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const db = require('../../data/dbConfig');

router.post('/api/register', async (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  const check = await db('users').where('phone_number', user.phone_number);

  if(check.length > 0) {
    res.status(403).json({ message: 'phone number already exists'})
  } else try {
    const result = await db('users').insert(user)
    res.status(200).json(result)
  } catch(err) {
    res.status(500).json({ message: 'error' })
  }
})

module.exports = router;