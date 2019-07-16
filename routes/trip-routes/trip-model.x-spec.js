const db = require('../../data/dbConfig');
const Trips = require('./trip-model');

const user = {
  id: 100,
  name: 'Kate',
  phone_number: 321,
  password: 'pass'
}

const trip = {
  id: 1000000,
  primary_member_id: 100,
  ride_fare: 10
}

describe('the trips model', () => {
  afterEach(async () => {
    await db('users').truncate();
    await db('trips').truncate();
  });

  describe('find', () => {
    afterEach(async () => {
      await db('users').truncate();
      await db('trips').truncate();
    });

    it('should return an array', async () => {
      await db('users')
        .insert(user)
      
      const res = await Trips.find(user.id)
      expect(res).toMatchObject([]);
    })
  })

  describe('findById', () => {
    afterEach(async () => {
      await db('users').truncate();
      await db('trips').truncate();
    });

    it('should return the trip', async () => {
      await db('users')
        .insert(user)

      await db('trips')
        .insert(trip)

      const res = await Trips.findById(trip.id)
      expect(res).toMatchObject(trip)
    })
  })

  describe('insert', () => {
    afterEach(async () => {
      await db('users').truncate();
      await db('trips').truncate();
    });

    it('should add a trip into the database', async () => {
      await db('users')
        .insert(user)

      const res = await Trips.insert(user.id, trip)
      expect(res[0]).toMatchObject(trip)
    })
  })

  describe('update', () => {
    afterEach(async () => {
      await db('users').truncate();
      await db('trips').truncate();
    });

    it('should update the trip', async () => {
      await db('users')
        .insert(user)

      await db('trips')
        .insert(trip)

      const res = await Trips.update(trip.id, { ride_fare: 15 })
      expect(res).toBe(1)

      const getTrip = await Trips.findById(trip.id)
      expect(getTrip.ride_fare).toBe(15)
    })
  })

  describe('remove', () => {
    afterEach(async () => {
      await db('users').truncate();
      await db('trips').truncate();
    });

    it('should delete the correct trip', async () => {
      await db('users')
        .insert(user)

      await db('trips')
        .insert(trip)

      const res = Trips.remove(trip.id);
      // console.log(res)
    })
  })
})