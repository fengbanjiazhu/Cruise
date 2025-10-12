import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// Leaflet marker icon fix for default icon not showing in some bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function RouteBetweenWaypoints({
  waypoints,
  profile = "foot",
  scenic = true,
  handleSave,
  setWaypoints,
}) {
  // Add waypoint on map click
  const map = useMapEvents({
    click: (e) => {
      if (typeof setWaypoints === "function") {
        setWaypoints((wps) => [
          ...wps,
          {
            id: Math.random().toString(36).slice(2),
            position: [e.latlng.lat, e.latlng.lng],
            label: `Waypoint ${wps.length + 1}`,
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          },
        ]);
      }
    },
  });
  const routeRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Remove existing control if present
    if (routeRef.current) {
      try {
        map.removeControl(routeRef.current);
      } catch {
        // Ignore removal errors
      }
      routeRef.current = null;
    }

    // Need at least 2 waypoints to draw a route
    if (!waypoints || waypoints.length < 2) return;

    // Only use waypoints with valid position arrays
    const latLngs = waypoints
      .filter((w) => Array.isArray(w.position) && w.position.length === 2)
      .map((w) => L.latLng(w.position[0], w.position[1]));
    if (latLngs.length < 2) return;

    // Create routing control using public OSRM demo server
    routeRef.current = L.Routing.control({
      waypoints: latLngs,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile, // 'car' | 'bike' | 'foot'
      }),
      addWaypoints: false, // disable UI waypoint dragging (we manage markers)
      draggableWaypoints: false,
      fitSelectedRoutes: true, // auto-zoom to route
      show: false, // hide the default itinerary panel
      routeWhileDragging: false,
      showAlternatives: scenic,
      altLineOptions: {
        styles: [
          { color: "#6B7280", opacity: 0.7, weight: 4 }, // alt line
        ],
      },
      // OSRM alternatives count
      // LRM passes "alternatives" to OSRM under the hood when true
      // We'll set it by passing options on the control:
      routerOptions: { alternatives: scenic },
      lineOptions: {
        styles: [
          { color: "#111827", opacity: 0.95, weight: 5 }, // dark gray main line
          { color: "#9CA3AF", opacity: 0.4, weight: 8 }, // subtle halo
        ],
        extendToWaypoints: true,
      },
      createMarker: () => null, // we render our own markers
    }).addTo(map);

    // Listen for route selected event, save it to parent
    routeRef.current.on("routeselected", (e) => {
      const { coordinates, summary } = e.route;
      if (handleSave) handleSave({ coordinates, summary });
    });

    return () => {
      if (routeRef.current) {
        try {
          map.removeControl(routeRef.current);
        } catch {
          // Ignore removal errors
        }
        routeRef.current = null;
      }
    };
  }, [map, waypoints, profile, scenic]);

  return null;
}

export default RouteBetweenWaypoints;
