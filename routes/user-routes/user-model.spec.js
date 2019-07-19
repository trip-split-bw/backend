const db = require('../../data/dbConfig');
const Users = require('./user-model');

const user = {
  name: 'Test',
  phone_number: 12223334444,
  password: 'password',
  money_app_link: 'paypal.me/fake'
};

describe('the users model', () => {
  afterEach(async () => {
    await db('trips').truncate();
    await db('users').truncate();
  });

  describe('find', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return the users in the database', async () => {
      let res = await Users.find();
      expect(res).toMatchObject([]);

      await db('users')
        .insert(user);

      res = await Users.find();

      expect(res[0].name).toBe(user.name);
    });
  });

  describe('findById', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return the correct user', async () => {
      let [id] = await db('users')
        .insert(user);

      let res = await Users.findById(id);
      expect(res.name).toBe(user.name);

      [id] = await db('users')
        .insert({
          name: 'Test2',
          phone_number: 13334445555,
          password: 'password',
          money_app_link: 'paypal.me/fake2'
        });
      
      res = await Users.findById(id);
      expect(res.name).toBe('Test2');
    });
  });

  describe('update', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should update the user and return the amount of updated records', async () => {
      const [id] = await db('users')
        .insert(user);

      const changes = {
        ...user,
        name: 'Update Test'
      }

      let res = await Users.update(id, changes);
      expect(res).toBe(1);

      res = await Users.findById(id);
      expect(res.name).toBe(changes.name);
    });
  });

  describe('remove', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should remove the user and return the amount of deleted records', async () => {
      const [id] = await db('users')
        .insert(user);

      let res = await Users.remove(id);
      expect(res).toBe(1);

      res = await Users.findById(id);
      expect(res).toBe(undefined);
    });
  });
});