module.exports = {
  __esModule: true,
  default: {},
  Routing: {
    control: jest.fn(() => ({
      addTo: jest.fn().mockReturnThis(),
      on: jest.fn().mockReturnThis(),
      getPlan: jest.fn(),
      setWaypoints: jest.fn(),
      spliceWaypoints: jest.fn(),
      remove: jest.fn(),
    })),
    osrmv1: jest.fn(() => ({
      route: jest.fn((waypoints, callback) => {
        // Simulate a successful route response
        callback(null, [{ coordinates: [[1,2],[3,4]] }]);
      }),
    })),
  },
};
