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
  id: 10,
  name: 'Bob',
  phone_number: 1234567890,
  password: 'pass'
}

const trip = {
  id: 1,
  primary_member_id: 10,
  ride_fare: 20,
}

describe('trip-router.js', () => {
  afterEach(async () => {
    await db('trips').truncate();
    await db('users').truncate();
  });

  describe('GET /api/trips/', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return status 401 if not authorized', async () => {
      const res = await request(server)
        .get('/api/trips')
        
      expect(res.status).toBe(401)
    })

    it('should return status 200', async () => {
      const res = await request(server)
        .get('/api/trips')
        .set({ 
          authorization: jwt.sign(payload, jwtSecret, options), 
          user: '10' 
        })

      expect(res.status).toBe(200)
    });
  })

  describe('GET /api/trips/:trip_id', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return status 401 if not authorized', async () => {
      const res = await request(server)
        .get('/api/trips/1')

      expect(res.status).toBe(401)
    })

    it('should return status 200', async () => {
      await db('users')
        .insert(user)

      await db('trips')
        .insert(trip)

      const res = await request(server)
        .get('/api/trips/1')
        .set({ 
          authorization: jwt.sign(payload, jwtSecret, options), 
          user: '10' 
        })

      expect(res.status).toBe(200)
    });
  })

  describe('POST /api/users/:id/trips/', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should insert a trip into the database and response 200', async () => {
      await request(server)
        .post('/api/register')
        .send(user)

      const res = await request(server)
        .post('/api/users/10/trips')
        .send(trip)
        .set({
          authorization: jwt.sign(payload, jwtSecret, options), 
        })

     expect(res.status).toBe(200)
    })
  })

  xdescribe('GET /api/users/:id/trips/:trip_id', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return the trip', async () => {
      await request(server)
        .post('/api/register')
        .send(user)

      await request(server)
        .post('/api/users/10/trips')
        .send(trip)
        .set({
          authorization: jwt.sign(payload, jwtSecret, options), 
        })

      const res = await request(server)
        .get('/api/users/10/trips/1')
        .set({
          authorization: jwt.sign(payload, jwtSecret, options), 
        })

      expect(res.body.ride_fare).toBe(20)
    })
  })

  xdescribe('PUT /api/users/:id/trips/:trip_id', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should update the trip', async function() {
      await request(server)
        .post('/api/register')
        .send(user)

      await request(server)
        .post('/api/users/10/trips')
        .send(trip)
        .set({
          authorization: jwt.sign(payload, jwtSecret, options), 
        })

      await request(server)
        .put('/api/users/10/trips/1')
        .send({ 
          ...user,
          ride_fare: 40 
        })
        .set({
          authorization: jwt.sign(payload, jwtSecret, options), 
        })
        
      const res = await request(server)
        .get('/api/users/10/trips/1')
        .set({
          authorization: jwt.sign(payload, jwtSecret, options), 
        })

    expect(res.body.ride_fare).toBe(40)
    })
  })
})