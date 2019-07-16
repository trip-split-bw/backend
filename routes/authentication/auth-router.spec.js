const request = require('supertest');
const server = require('../../api/server');

const db = require('../../data/dbConfig');

describe('auth-router.js', () => {
  afterEach(async () => {
    await db('users').truncate();
  });

  describe('POST /api/register', () => {
    const user = {
      name: 'test',
      phone_number: 1234567890,
      password: 'pass'
    }
  
    afterEach(async () => {
      await db('users').truncate();
    });
  
    it('should return json and status 200', async () => {
      const res = await request(server)
        .post('/api/register')
        .send(user);
  
      expect(res.status).toBe(200);
      expect(res.type).toBe('application/json');
      expect(res.body.name).toBe('test')
    })
  
    it('should return status 403 if user exists in the database with message \'phone number already exists\'', async () => {
      await request(server)
        .post('/api/register')
        .send(user);
  
      const res = await request(server)
        .post('/api/register')
        .send({ ...user });
  
      expect(res.status).toBe(403);
      expect(res.body).toEqual({ message: 'phone number already exists' });
    })
  
    it('should return status 422 with message \'invalid format\' if data is missing', async () => {
      let newUser = {
        ...user
      }
      delete newUser.name;
  
      const res = await request(server)
        .post('/api/register')
        .send(newUser);
  
      expect(res.status).toBe(422);
      expect(res.body).toEqual({ message: 'invalid format' });
    })
  })
  
  describe('POST /api/login', () => {
    afterEach(async () => {
      await db('users').truncate();
    });
    
    const user = {
      name: 'test',
      phone_number: 1234567890,
      password: 'pass'
    }
  
    it('should return status 200 with a welcome message', async () => {
      await request(server)
        .post('/api/register')
        .send(user);
  
      let login = {
        phone_number: user.phone_number,
        password: user.password
      }
  
      const res = await request(server)
        .post('/api/login')
        .send(login)
  
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Welcome, test!')
    })

    it('should return status 403 and message \'Invalid format\' if phone number or password are not present', async () => {
      await request(server)
        .post('/api/register')
        .send(user);

      const res = await request(server)
        .post('/api/login')
        .send({ phone_number: user.phone_number})

      expect(res.status).toBe(403)
      expect(res.body.message).toBe('Invalid format')
    })

    it('should return status 401 and message \'Invalid Credentials\' if password is wrong', async () => {
      await request(server)
        .post('/api/register')
        .send(user);

      const badPassword = {
        ...user,
        password: 'invalid'
      }

      const res = await request(server)
        .post('/api/login')
        .send(badPassword)

      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Invalid Credentials')
    })
  })  
})