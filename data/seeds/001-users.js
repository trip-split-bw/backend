
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1, 
          name: 'Bob',
          phone_number: 1112223334,
          password: 'password1'
        },
        {
          id: 2, 
          name: 'Mary',
          phone_number: 2223334445,
          password: 'password2'
        },
        {
          id: 3, 
          name: 'Dave',
          phone_number: 33344455556,
          password: 'password3'
        },
      ]);
    });
};
