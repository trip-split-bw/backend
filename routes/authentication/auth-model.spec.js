const db = require('../../data/dbConfig');
const Auth = require('./auth-model');

const user = {
  name: 'test',
  phone_number: 1234567890,
  password: 'pass'
}

describe('the authorization model', () => {
  afterEach(async () => {
    await db('users').truncate();
  });

  describe('register', () => {
    afterEach(async () => {
      await db('users').truncate();
    });

    it('should return the registered user', async () => {
      const res = await Auth.register(user);

      expect(res.name).toBe('test')
    })
  })

  describe('validate', () => {
    afterEach(async () => {
      await db('users').truncate();
    });

    it('should return true if the phone number does not exist in the database', async () => {
      await Auth.register(user)

      const res = await Auth.validate(9876543210)
      expect(res).toBe(true)
    })

    it('should return false if the phone number does not exist in the database', async () => {
      await Auth.register(user)

      const res = await Auth.validate(user.phone_number)
      expect(res).toBe(false)
    })
  })

  describe('login', () => {
    afterEach(async () => {
      await db('users').truncate();
    });

    it('should return the correct user', async () => {
      await Auth.register(user)

      const res = await Auth.login({
        phone_number: user.phone_number,
        password: user.password
      })

      expect(res).toMatchObject(user)
    })
  })
})