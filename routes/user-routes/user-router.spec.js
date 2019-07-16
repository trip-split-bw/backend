const request = require('supertest');
const server = require('../../api/server');

const db = require('../../data/dbConfig');

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/secret');

const payload = {
  subject: 1,
  username: 1234567890,
  roles: ['user']
};

const options = {
  expiresIn: '1d',
};

const user = {
  name: 'Bob',
  phone_number: 1234567890,
  password: 'pass'
}

describe('user-router.js', () => {
  afterEach(async () => {
    await db('users').truncate();
  });
  
  describe('GET /api/users', () => {
    afterEach(async () => {
      await db('users').truncate();
    });
  
    it('should return status 401 with message \'Unauthorized\' if not authorized', async () => {
      const res = await request(server)
        .get('/api/users')
  
      expect(res.status).toBe(401)
      expect(res.body.message).toBe('Unauthorized')
    })
  
    it('should return status 200 when authorized', async () => {
      await request(server)
        .get('/api/users')
        .set({ authorization: jwt.sign(payload, jwtSecret, options) })
        .expect(200);
    })
  })

  describe('GET /api/users/:id', () => {
    afterEach(async () => {
      await db('users').truncate();
    });

    it('should return status 200 and the correct user when authorized', async () => {
      const query = await request(server)
        .post('/api/register')
        .send(user)

      const res = await request(server)
        .get(`/api/users/${query.body.id}`)
        .set({ authorization: jwt.sign(payload, jwtSecret, options) })

      expect(res.status).toBe(200)
      expect(res.body.name).toBe('Bob')
    })
  })

  describe('PUT /api/users/:id', () => {
    afterEach(async () => {
      await db('users').truncate();
    });

    it('should return status 200 and the correct changes when authorized', async () => {
      const query = await request(server)
        .post('/api/register')
        .send(user)
      console.log(query.body)
      const res = await request(server)
        .put(`/api/users/${query.body.id}`) 
        .send({
          name: 'Bill',
          phone_number: 1233214321,
          password: 'password'
        })
        .set({ authorization: jwt.sign(payload, jwtSecret, options) })
        
      expect(res.status).toBe(200)
      expect(res.body.name).toBe('Bill');
    })
  })

  describe('DELETE /api/users/:id', () => {
    afterEach(async () => {
      await db('users').truncate();
    });

    it('should delete user and send status 200', async () => {
      const query = await request(server)
        .post('/api/register')
        .send({
          name: 'test',
          phone_number: 3213211234,
          password: 'pass'
        })

      const res = await request(server)
        .delete(`/api/users/${query.body.id}`)
        .set({ authorization: jwt.sign(payload, jwtSecret, options) })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('deleted successfully')
    })
  })
})