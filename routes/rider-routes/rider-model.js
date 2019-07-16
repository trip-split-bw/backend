const db = require('../../data/dbConfig');

module.exports = {
  find,
  findRider,
  filterByTrip,
  insert,
  update,
  remove
}

function find() {
  return db('riders')
}

function findRider(riderId) {
  return find()
    .where('id', riderId)
    .first()
}

function filterByTrip(tripId) {
  return find()
    .where('trip_id', tripId)
}

function insert(tripId, rider) {
  return find()
    .insert({
      ...rider,
      trip_id: tripId
    })
}

function update(riderId, changes) {
  return findRider(riderId)
    .update(changes)
}

function remove(riderId) {
  return findRider(riderId)
    .del()
}