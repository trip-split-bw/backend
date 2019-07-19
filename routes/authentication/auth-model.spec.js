const db = require('../../data/dbConfig');
const Auth = require('./auth-model');

const user = {
  name: 'Test',
  phone_number: 12223334444,
  password: 'password',
  money_app_link: 'paypal.me/fake'
};

const login = {
  phone_number: 12223334444,
  password: 'password',
};

describe('the authorization model', () => {
  afterEach(async () => {
    await db('trips').truncate();
    await db('users').truncate();
  });

  describe('register', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should register and return the user', async () => {
      const res = await Auth.register(user);
      expect(res.name).toBe(user.name);
    });
  });

  describe('validate', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return true if the phone number does not exist in the database', async () => {
      const res = await Auth.validate(1234567890);
      expect(res);
    });

    it('should return false if the phone number does exist in the database', async () => {
      await db('users')
        .insert(user);

      const res = await Auth.validate(user.phone_number);
      expect(!res);
    });
  });

  describe('login', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return the logged in user', async () => {
      await db('users')
        .insert(user);

      const res = await Auth.login(login);
      expect(res.name).toBe(user.name);
    });
  });
});