
import { jest } from '@jest/globals';
// Increase Jest timeout for slow DB operations
jest.setTimeout(30000);

import request from 'supertest';
import mongoose from 'mongoose';
import Path from '../Models/pathModel.js';

let createdPathId;


// Dummy path data (all required fields)
const dummyPath = {
  name: 'Test Path for API',
  description: 'A path for testing',
  distance: 10,
  duration: 20,
  profile: 'car',
  locations: [
    { lat: 1.23, lng: 4.56 },
    { lat: 7.89, lng: 0.12 }
  ],
  waypoints: [
    { label: 'A', lat: 1.23, lng: 4.56 },
    { label: 'B', lat: 7.89, lng: 0.12 }
  ]
};

const updatedPath = {
  name: 'Updated Path for API',
  description: 'Updated description',
  distance: 15,
  duration: 25,
  profile: 'car',
  locations: [
    { lat: 9.87, lng: 6.54 },
    { lat: 3.21, lng: 0.98 }
  ],
  waypoints: [
    { label: 'C', lat: 9.87, lng: 6.54 },
    { label: 'D', lat: 3.21, lng: 0.98 }
  ]
};


import app from '../server.js';

describe('Path API', () => {
  let token;
  const testUser = {
    name: 'Test User',
    email: 'testuser_path_api@example.com',
    password: 'TestPass123!',
    passwordConfirm: 'TestPass123!'
  };

  beforeAll(async () => {
    // Register user (ignore errors if already exists)
    try {
      await request(app)
        .post('/api/user/register')
        .send(testUser);
    } catch (e) {}
    // Login user
    const loginRes = await request(app)
      .post('/api/user/login')
      .send({ email: testUser.email, password: testUser.password });
    token = loginRes.body.token || loginRes.body.data?.token;
    if (!token && loginRes.headers['set-cookie']) {
      // fallback: try to extract from cookie if needed
      const cookie = loginRes.headers['set-cookie'].find(c => c.includes('jwt='));
      if (cookie) token = cookie.split('jwt=')[1].split(';')[0];
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new path', async () => {
    const res = await request(app)
      .post('/api/path')
      .set('Authorization', `Bearer ${token}`)
      .send(dummyPath)
      .expect(201);
    console.log('CREATE PATH RESPONSE:', res.body);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.data).toBeDefined();
    expect(res.body.data.data.name).toBe(dummyPath.name);
    createdPathId = res.body.data.data._id;
  });

  it('should update the created path', async () => {
    const res = await request(app)
      .patch(`/api/path/${createdPathId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPath);
    console.log('UPDATE PATH FULL RESPONSE:', res);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.data).toBeDefined();
    expect(res.body.data.data.name).toBe(updatedPath.name);
  });

  it('should delete the created path', async () => {
    const res = await request(app)
      .delete(`/api/path/${createdPathId}`)
      .set('Authorization', `Bearer ${token}`);
    console.log('DELETE PATH FULL RESPONSE:', res);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    // Optionally, check that the path is gone
    const found = await Path.findById(createdPathId);
    expect(found).toBeNull();
  });
});
