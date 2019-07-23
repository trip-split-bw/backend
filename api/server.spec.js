const request = require('supertest');
const server = require('./server.js');

const db = require('../data/dbConfig');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/secret');

const auth = { 
  authorization: jwt.sign({
    subject: 1,
    username: 1234567890,
    roles: ['user']
  }, jwtSecret, {
    expiresIn: '1d',
  }) 
};

const register = {
  name: 'Test',
  phone_number: 12223334444,
  password: 'password',
  money_app_link: 'paypal.me/fake'
};

const login = {
  phone_number: 12223334444,
  password: 'password',
};

  /* TESTING ALL ENDPOINTS */
// server
describe('server.js', () => {
  afterEach(async () => {
    await db('trips').truncate();
    await db('users').truncate();
  });

  describe('GET /', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should set the test environment', () => {
      expect(process.env.DB_ENV).toBe('testing');
    });

    it('should return json and status 200 with a message that the api is active', async () => {
      const res = await request(server)
        .get('/');

    expect(res.type).toBe('application/json');
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({ api: 'active' });
    });
  });
});

  /* ROUTES */
// auth router
describe('suth-router.js', () => {
  afterEach(async () => {
    await db('trips').truncate();
    await db('users').truncate();
  });

  describe('POST /api/register', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should register the user', async () => {
      const res = await request(server)
        .post('/api/register')
        .send(register);

      expect(res.body.name).toBe(register.name);
    });

    it('should respond with json and status 422 and message that the format is invalid if name, phone number, or password are not present', async () => {
      let user = {...register};
      delete user.name;

      const res = await request(server)
        .post('/api/register')
        .send(user);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(422);
      expect(res.body).toStrictEqual({ message: 'invalid format' });

      user = {...register};
      delete user.phone_number;

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(422);
      expect(res.body).toStrictEqual({ message: 'invalid format' });

      user = {...register};
      delete user.password;

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(422);
      expect(res.body).toStrictEqual({ message: 'invalid format' });
    });

    it('should respond with json and status 403 with the message \'phone number already exists\' if the phone number exists in the database', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      const res = await request(server)
        .post('/api/register')
        .send(register);

      expect(res.type).toBe('application/json')
      expect(res.status).toBe(403)
      expect(res.body).toStrictEqual({ message: 'phone number already exists' });
    });
  });

  describe('POST /api/login', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return json and status 200 with a welcome message if the login is successful', async () => {
      await request(server)
        .post('/api/register')
        .send(register)

      const res = await request(server)
        .post('/api/login')
        .send(login)
      
      expect(res.type).toBe('application/json')
      expect(res.status).toBe(200)
      expect(res.body.message).toBe(`Welcome, ${register.name}!`)
    });

    it('should return json and status 403 with the message \'invalid credentials\' if phone number or password are missing', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      let user = {...login};
      delete user.phone_number;

      const res = await request(server)
        .post('/api/login')
        .send(user);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'invalid format' });

      user = {...login};
      delete user.password;

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'invalid format' });
    });

    it('should return json and status 401 with message \'invalid credentials\' if the phone number or password are wrong', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      let user = {...login};
      user.phone_number = 19998887777;

      const res = await request(server)
        .post('/api/login')
        .send(user)

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({ message: 'invalid credentials' });

      user = {...login};
      user.password = 'bad-password';

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({ message: 'invalid credentials' });
    });
  });
});

// user router
describe('user-router.js', () => {
  afterEach(async () => {
    await db('trips').truncate();
    await db('users').truncate();
  });

  describe('GET /api/users', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return json and status 200 with the users in the database', async () => {
      let res = await request(server)
        .get('/api/users')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject([]);

      await request(server)
        .post('/api/register')
        .send(register);

      res = await request(server)
        .get('/api/users')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body[0].name).toBe(register.name);
    });

    it('should return json and status 401 with message \'unauthorized\' if the authorization header isn\'t present', async () => {
      const res = await request(server)
        .get('/api/users');

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({ message: 'unauthorized' });
    });
  });

  describe('GET /api/users/:id', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should json and status 200 with return the correct user', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      const res = await request(server)
        .get('/api/users/1')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(register.name);
    });

    it('should return json and status 403 with message \'user not found\' if the user doesn\'t exist in the database', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      const res = await request(server)
        .get('/api/users/2')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'user not found' });
    });

    it('should return json and status 401 with message \'unauthorized\' if the authorization header isn\'t present', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      const res = await request(server)
        .get('/api/users/1');

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({ message: 'unauthorized' });
    });
  });

  describe('PUT /api/users/:id', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    const user = {
      ...register,
      name: 'Put Test'
    }

    it('should return json and status 200 with the updated user', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      const res = await request(server)
        .put('/api/users/1')
        .send(user)
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe(user.name);
    });

    it('should return json and status 403 with message \'invalid format\' if name, phone number, or password are not present', async () => {
      await request(server)
        .post('/api/register')
        .send(register)

      let test = {...user};
      delete test.name;

      let res = await request(server)
        .put('/api/users/1')
        .send(test)
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'invalid format' });

      test = {...user};
      delete test.phone_number;

      res = await request(server)
        .put('/api/users/1')
        .send(test)
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'invalid format' });

      test = {...user};
      delete test.password;

      res = await request(server)
        .put('/api/users/1')
        .send(test)
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'invalid format' });
    });

    it('should return json and status 401 with message \'unauthorized\' if the authorization header isn\'t present', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      const res = await request(server)
        .put('/api/users/1')
        .send(user);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({ message: 'unauthorized' });
    });

    it('should return json and status 403 with message \'user not found\' if the user doesn\'t exist in the database', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      const res = await request(server)
        .put('/api/users/2')
        .send(user)
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'user not found' });
    });
  });

  describe('DELETE /api/users/:id', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return json and status 200 with message \'deleted successfully\'', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      const res = await request(server)
        .delete('/api/users/1')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({ message: 'deleted successfully' });
    });

    it('should return json and status 401 with message \'unauthorized\' if the authorization header isn\'t present', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      const res = await request(server)
        .delete('/api/users/1');

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({ message: 'unauthorized' });
    });

    it('should return json and status 403 with message \'user not found\' if the user doesn\'t exist in the database', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      const res = await request(server)
        .delete('/api/users/2')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'user not found' });
    });
  });
});

//trip router
const trip = {
  id: 1,
  primary_member_id: 1,
  ride_fare: 20,
  riders: 'empty'
}

describe('trip-router.js', () => {
  afterEach(async () => {
    await db('trips').truncate();
    await db('users').truncate();
  });

  describe('GET /api/trips', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return json and status 200 with a list of trips in the database', async () => {
      let res = await request(server)
        .get('/api/trips')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject([]);

      await request(server)
        .post('/api/register')
        .send(register);

      await db('trips')
        .insert(trip);
      
      res = await request(server)
        .get('/api/trips')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body[0].riders).toBe(trip.riders);
    });

    it('should return json and status 401 with message \'unauthorized\' if the authorization header isn\'t present', async () => {
      const res = await request(server)
        .get('/api/trips');

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({ message: 'unauthorized' });
    });
  });

  describe('GET /api/trips/:trip_id', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return json and status 200 with the correct trip', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      await db('trips')
        .insert(trip);
      
      const res = await request(server)
        .get('/api/trips/1')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body.riders).toBe(trip.riders);
    });

    it('should return json and status 401 with message \'unauthorized\' if the authorization header isn\'t present', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      await db('trips')
        .insert(trip);
      
      const res = await request(server)
        .get('/api/trips/1');

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({ message: 'unauthorized' });
    });

    it('should return json and status 403 with message \'trip not found\' if the trip doesn\'t exist in the database', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      await db('trips')
        .insert(trip);

      const res = await request(server)
        .get('/api/trips/2')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'trip not found' });
    });
  });

  describe('GET /api/users/:id/trips', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return json and status 200 with the trips for the correct user', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      await db('trips')
        .insert(trip);

      const res = await request(server)
        .get('/api/users/1/trips')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body[0].riders).toBe(trip.riders);
    });

    it('should return json and status 401 with message \'unauthorized\' if the authorization header isn\'t present', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      await db('trips')
        .insert(trip);
      
      const res = await request(server)
        .get('/api/users/1/trips');

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({ message: 'unauthorized' });
    });

    it('should return json and status 403 with message \'user not found\' if the user doesn\'t exist in the database', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      await db('trips')
        .insert(trip);

      const res = await request(server)
        .get('/api/users/2/trips')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'user not found' });
    });
  });

  describe('POST /api/trips', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return json and status 200 with the trip that was inserted into the database', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      const res = await request(server)
        .post('/api/trips')
        .send(trip)
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body.riders).toBe(trip.riders);
    });

    it('should return json and status 401 with message \'unauthorized\' if the authorization header isn\'t present', async () => {
      await request(server)
        .post('/api/register')
        .send(register);
      
      const res = await request(server)
        .post('/api/trips');

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({ message: 'unauthorized' });
    });

    it('should return json and status 403 with message \'invalid format\' if primary member id, ride fare, or riders isn\'t present', async () => {
      await request(server)
        .post('/api/register')
        .send(register);
      
      let _trip = {...trip};
      delete _trip.primary_member_id;

      let res = await request(server)
        .post('/api/trips')
        .send(_trip)
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'invalid format' });

      _trip = {...trip};
      delete _trip.ride_fare;

      res = await request(server)
        .post('/api/trips')
        .send(_trip)
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'invalid format' });

      _trip = {...trip};
      delete _trip.riders;

      res = await request(server)
        .post('/api/trips')
        .send(_trip)
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'invalid format' });
    });
  });

  describe('PUT /api/trips/:trip_id', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    let _trip = {
      ...trip,
      riders: "put test"
    }

    it('should return json and status 200 with the updated trip', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      await request(server)
        .post('/api/trips')
        .send(trip)
        .set(auth);

      const res = await request(server)
        .put('/api/trips/1')
        .send(_trip)
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body.riders).toBe(_trip.riders);
    });

    it('should return json and status 401 with message \'unauthorized\' if the authorization header isn\'t present', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      await request(server)
        .post('/api/trips')
        .send(trip)
        .set(auth);
      
      const res = await request(server)
        .put('/api/trips/1')
        .send(_trip);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({ message: 'unauthorized' });
    });

    it('should return json and status 403 with message \'invalid format\' if ride fare, or riders isn\'t present', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      let _trip = {...trip};
      delete _trip.ride_fare;

      let res = await request(server)
        .post('/api/trips')
        .send(_trip)
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'invalid format' });

      _trip = {...trip};
      delete _trip.riders;

      res = await request(server)
        .post('/api/trips')
        .send(_trip)
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'invalid format' });
    });
  });

  describe('DELETE /api/trips/:trip_id', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return json and status 200 with message \'deleted successfully\'', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      await request(server)
        .post('/api/trips')
        .send(trip)
        .set(auth);

      const res = await request(server)
        .delete('/api/trips/1')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({ message: 'deleted successfully' });
    });

    it('should return json and status 401 with message \'unauthorized\' if the authorization header isn\'t present', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      await request(server)
        .post('/api/trips')
        .send(trip)
        .set(auth);

      const res = await request(server)
        .delete('/api/trips/1');

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(401);
      expect(res.body).toStrictEqual({ message: 'unauthorized' });
    });

    it('should return json and status 403 with message \'trip not found\' if the trip doesn\'t exist in the database', async () => {
      await request(server)
        .post('/api/register')
        .send(register);

      await request(server)
        .post('/api/trips')
        .send(trip)
        .set(auth);

      const res = await request(server)
        .delete('/api/trips/2')
        .set(auth);

      expect(res.type).toBe('application/json');
      expect(res.status).toBe(403);
      expect(res.body).toStrictEqual({ message: 'trip not found' });
    });
  });
});

// text router
/* verified through direct testing */