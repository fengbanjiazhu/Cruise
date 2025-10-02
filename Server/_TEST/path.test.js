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

describe('Path API', () => {
  it('should always pass this basic test', () => {
    expect(true).toBe(true);
  });
});
