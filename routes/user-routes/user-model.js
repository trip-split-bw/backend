const db = require('../../data/dbConfig');

module.exports = {
  find,
  findById,
  update,
  remove
};

function find() {
  return db('users')
}

function findById(id) {
  return db('users')
    .where('users.id', id)
    .first();
}

function update(id, changes) {
  return findById(id).update(changes);
}

function remove(id) {
  return findById(id).del();
}