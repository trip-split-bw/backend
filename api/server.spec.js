const request = require('supertest');
const server = require('./server.js');

// the basics
describe('server.js', () => {
  it('should set the test environment', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });

  describe('GET /', () => {
    it('should return json, status 200, and api: active', async () => {
      const res = await request(server)
        .get('/')
      
      expect(res.type).toBe('application/json');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ api: 'active' });
    })
  })
})