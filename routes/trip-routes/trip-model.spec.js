const db = require('../../data/dbConfig');
const Trips = require('./trip-model');

const user = {
  name: 'Test',
  phone_number: 12223334444,
  password: 'password',
  money_app_link: 'paypal.me/fake'
};

const trip = {
  primary_member_id: 1,
  ride_fare: 20,
  riders: 'empty'
}

describe('the trip model', () => {
  afterEach(async () => {
    await db('trips').truncate();
    await db('users').truncate();
  });

  describe('find', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return the trips in the database', async () => {
      let res = await Trips.find();
      expect(res).toMatchObject([]);

      await db('users')
        .insert(user);

      await db('trips')
        .insert(trip);

      res = await Trips.find();
      expect(res[0].ride_fare).toBe(trip.ride_fare);
    });
  });

  describe('findTrip', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return the correct trip', async () => {
      await db('users')
        .insert(user);

      let [id] = await db('trips')
        .insert(trip);

      let res = await Trips.findTrip(id);
      expect(res.ride_fare).toBe(trip.ride_fare);

      [id] = await db('trips')
        .insert({
          ...trip,
          ride_fare: 25
        });

      res = await Trips.findTrip(id);
      expect(res.ride_fare).toBe(25);
    });
  });

  describe('filterByPrimary', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should return the users trips', async () => {
      let [id] = await db('users')
        .insert(user);

      await db('trips')
        .insert(trip);

      await db('trips')
        .insert({
          ...trip,
          ride_fare: 25
        });

      const res = await Trips.filterByPrimary(id);
      expect(res[0].ride_fare).toBe(20);
      expect(res[1].ride_fare).toBe(25);
    });
  });

  describe('insert', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should insert a trip into the database', async () => {
      await db('users')
        .insert(user);
        
      const [id] = await Trips.insert(trip);
      const res = await Trips.findTrip(id);
      expect(res.ride_fare).toBe(trip.ride_fare);
    });
  });

  describe('update', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should update the correct trip in the database', async () => {
      await db('users')
        .insert(user);

      const changes = {
        ...trip,
        ride_fare: 25
      }

      const [id] = await Trips.insert(trip);
      let res = await Trips.update(id, changes);
      expect(res).toBe(1)

      res = await Trips.findTrip(id);
      expect(res.ride_fare).toBe(changes.ride_fare);
    });
  });

  describe('remove', () => {
    afterEach(async () => {
      await db('trips').truncate();
      await db('users').truncate();
    });

    it('should remove the trip from the database', async () => {
      await db('users')
        .insert(user);

      const [id] = await Trips.insert(trip);
      let res = await Trips.remove(id);
      expect(res).toBe(1)

      res = await Trips.findTrip(id);
      expect(res).toBe(undefined);
    })
  });
});