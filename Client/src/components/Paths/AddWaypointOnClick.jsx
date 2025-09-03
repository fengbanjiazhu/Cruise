import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";

function AddWaypointOnClick({ addWaypoint }) {
  useMapEvents({
    click(e) {
      addWaypoint([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default AddWaypointOnClick;
