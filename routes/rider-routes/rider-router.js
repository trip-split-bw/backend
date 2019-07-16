const express = require('express');
const router = express.Router();
const restricted = require('../authentication/restricted-middleware');

const Riders = require('./rider-model');
const db = require('../../data/dbConfig');

router.get('/api/riders', restricted, async (req, res) => {
  try {
    const riders = await Riders.find()
    res.status(200).json(riders)
  } catch {
    res.status(500).json(err)
  }
})

router.get('/api/riders/:rider_id', restricted, validateData, async (req, res) => {
  const rider_id = parseInt(req.params.rider_id)
  const rider = await Riders.findRider(rider_id)

  res.status(200).json(rider)
}) 

router.get('/api/trips/:trip_id/riders', restricted, validateTrip, async (req, res) => {
  const trip_id = parseInt(req.params.trip_id);

  try {
    const riders = await Riders.filterByTrip(trip_id)

    if(riders.length > 0) {
      res.status(200).json(riders)
    } else {
      res.status(401).json({ message: 'no riders found' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

router.post('/api/trips/:trip_id/riders', restricted, validateTrip, async (req, res) => {
  const id = parseInt(req.params.trip_id)

  try {
    const { name, trip_id, phone_number, money_owed } = req.body;

    if(name && trip_id && phone_number && money_owed) {
      const rider = await Riders.insert(id, req.body);

      res.status(200).json(rider)
    } else {
      res.status(403).json({ message: 'Invalid format' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

router.put('/api/riders/:rider_id', restricted, validateData, async (req, res) => {
  const rider_id = parseInt(req.params.rider_id);

  const { name, trip_id, phone_number, money_owed } = req.body;

  if(name && trip_id && phone_number && money_owed) {
    await Riders.update(rider_id, req.body);
    const rider = await Riders.findRider(rider_id);

    res.status(200).json(rider)
  } else {
    res.status(403).json({ message: 'Invalid format' })
  }
})

router.delete('/api/riders/:rider_id', restricted, validateData, async (req, res) => {
  const rider_id = parseInt(req.params.rider_id)
  await Riders.remove(rider_id)

  res.status(200).json({ message: 'deleted successfully' });
})

//middleware
async function validateData(req, res, next) {
  const rider_id = parseInt(req.params.rider_id);
  
  try {
    const rider = await Riders.findRider(rider_id)

    if(rider) {
      next()
    } else {
      res.status(403).json({ message: 'rider not found' })
    }
  } catch(err) {
    res.status(500).json(err)
  }
}

async function validateTrip(req, res, next) {
  const trip_id = parseInt(req.params.trip_id);
  const trip = await db('trips').where('id', trip_id).first()

  if(trip) {
    next()
  } else {
    res.status(401).json({ message: 'trip not found'})
  }
}

module.exports = router;