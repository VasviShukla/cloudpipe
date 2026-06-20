const request = require('supertest');
const app = require('./index');

describe('CloudPipe API', () => {

  test('GET / returns health check', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /info returns system info', async () => {
    const res = await request(app).get('/info');
    expect(res.statusCode).toBe(200);
    expect(res.body.hostname).toBeDefined();
    expect(res.body.nodeVersion).toBeDefined();
  });

  test('GET /items returns all items', async () => {
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toBeInstanceOf(Array);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test('GET /items?status=done filters by status', async () => {
    const res = await request(app).get('/items?status=done');
    expect(res.statusCode).toBe(200);
    res.body.items.forEach(item => expect(item.status).toBe('done'));
  });

  test('POST /items creates a new item', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'Test Item', priority: 'high' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Test Item');
    expect(res.body.status).toBe('pending');
  });

  test('POST /items fails without name', async () => {
    const res = await request(app).post('/items').send({});
    expect(res.statusCode).toBe(400);
  });

  test('PUT /items/:id updates an item', async () => {
    const res = await request(app)
      .put('/items/1')
      .send({ status: 'done' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('done');
  });

  test('DELETE /items/:id deletes an item', async () => {
    const res = await request(app).delete('/items/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Deleted');
  });

  test('GET /metrics returns metrics', async () => {
    const res = await request(app).get('/metrics');
    expect(res.statusCode).toBe(200);
    expect(res.body.uptime).toBeDefined();
  });

});
