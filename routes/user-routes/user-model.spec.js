const db = require('../../data/dbConfig');
const Users = require('./user-model');

const user = {
  id: 10000,
  name: 'James',
  phone_number: 555,
  password: 'pass'
}

describe('the users model', () => {
  afterEach(async () => {
    await db('users').truncate();
  });

  describe('find', () => {
    afterEach(async () => {
      await db('users').truncate();
    });

    it('should return an array', async () => {
      const res = await Users.find();
      expect(res).toMatchObject([]);
    })
  })

  describe('findById', () => {
    afterEach(async () => {
      await db('users').truncate();
    });

    it('should return the correct user', async () => {
      await db('users')
        .insert(user)

      const res = await Users.findById(10000)

      expect(res).toMatchObject(user)
    })
  })

  describe('update', () => {
    afterEach(async () => {
      await db('users').truncate();
    });

    it('should update the user', async () => {
      await db('users')
        .insert(user)

      const res = await Users.update(user.id, { name: 'Kurt' })
      expect(res).toBe(1)
    })
  })

  describe('remove', () => {
    afterEach(async () => {
      await db('users').truncate();
    });

    it('should delete the correct user and return the amount of deleted records', async () => {
      await db('users')
        .insert(user)

      const res = await Users.remove(user.id)
      expect(res).toBe(1)
    })
  })
})