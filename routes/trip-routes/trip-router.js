const express = require('express');
const router = express.Router();
const restricted = require('../authentication/restricted-middleware');

const Trips = require('./trip-model');
const db = require('../../data/dbConfig');

router.get('/api/trips', restricted, async (req, res) => {
  try {
    const trips = await Trips.find()
    res.status(200).json(trips)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/api/trips/:trip_id', restricted, validateData, async (req, res) => {
  const trip_id = parseInt(req.params.trip_id)
  const trip = await Trips.findTrip(trip_id)

  res.status(200).json(trip)
})

router.get('/api/users/:id/trips', restricted, validateUser, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const trips = await Trips.filterByPrimary(id);

    res.status(200).json(trips)
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post('/api/trips/', restricted, async (req, res) => {
  try {
    const { primary_member_id, ride_fare, riders } = req.body;

    if(primary_member_id && ride_fare && riders) {
      const [query] = await Trips.insert(req.body);
      const trip = await Trips.findTrip(query);
      
      res.status(200).json(trip)
    } else {
      res.status(403).json({ message: 'Invalid format' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

router.put('/api/trips/:trip_id', restricted, validateData, async (req, res) => {
  const trip_id = parseInt(req.params.trip_id);

  const { ride_fare } = req.body;

    if(ride_fare) {
      await Trips.update(trip_id, req.body)
      const trip = await Trips.findTrip(trip_id)

      res.status(200).json(trip)
    } else {
      res.status(403).json({ message: 'Invalid format' })
    }
})

router.delete('/api/trips/:trip_id', restricted, validateData, async (req, res) => {
  const trip_id = parseInt(req.params.trip_id);
  await Trips.remove(trip_id)
      
  res.status(200).json({ message: 'deleted successfully' });
})

//middleware
async function validateData(req, res, next) {
  const trip_id = parseInt(req.params.trip_id);

  try {
    const trip = await Trips.findTrip(trip_id);

    if(trip) {
      next()
    } else {
      res.status(403).json({ message: 'trip not found' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

async function validateUser(req, res, next) {
  const id = parseInt(req.params.id);

  try {
    const user = await db('users')
      .where('users.id', id)
      .first()

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