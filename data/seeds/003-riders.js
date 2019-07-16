
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('riders').del()
    .then(function () {
      // Inserts seed entries
      return knex('riders').insert([
        {
          id: 1, 
          name: 'friend 1',
          trip_id: 1,
          phone_number: 1111111111,
          money_owed: 10
        },
        {
          id: 2, 
          name: 'friend 2',
          trip_id: 1,
          phone_number: 2222222222,
          money_owed: 10
        },
        {
          id: 3, 
          name: 'friend 3',
          trip_id: 2,
          phone_number: 3333333333,
          money_owed: 5
        }
      ]);
    });
};
