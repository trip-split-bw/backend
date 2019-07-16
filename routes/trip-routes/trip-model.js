const db = require('../../data/dbConfig');

module.exports = {
  find,
  findTrip,
  filterByPrimary,
  insert,
  update,
  remove
}

function find() {
  return db('trips')
}

function findTrip(tripId) {
  return find()
    .where('id', tripId)
    .first()
}

function filterByPrimary(id) {
  return find()
    .where('primary_member_id', id)
}

function insert(primaryId, trip) {
  return db('trips')
    .insert({
      ...trip,
      primary_member_id: primaryId
    })
}

function update(tripId, changes) {
  return findTrip(tripId)
    .update(changes)
}

function remove(tripId) {
  return findTrip(tripId)
    .del()
}