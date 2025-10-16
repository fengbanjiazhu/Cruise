// This file runs before each test suite
import L from 'leaflet';

// Mock L.Routing to match the structure expected by RouteBetweenWaypoints
L.Routing = require('leaflet-routing-machine').Routing;
