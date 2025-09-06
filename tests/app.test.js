const request = require('supertest');
const app = require('../server');

test('GET / should return Hello message', async () => {
  const res = await request(app).get('/');
  expect(res.statusCode).toBe(200);
  expect(res.text).toBe('Hello from Node.js App!');
});
