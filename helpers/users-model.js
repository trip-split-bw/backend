const db = require('../data/dbConfig');

module.exports = {
  find,
};

async function find() {
  return await db('users');
}