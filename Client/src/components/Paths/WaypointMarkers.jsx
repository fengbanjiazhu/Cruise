import { Marker, Popup } from "react-leaflet";

function WaypointMarkers({ waypoints, setWaypoints }) {
  // Allow each marker to be draggable
  return waypoints.map((wp, idx) => (
    <Marker
      key={wp.id}
      position={wp.position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const newPos = [e.target.getLatLng().lat, e.target.getLatLng().lng];
          setWaypoints((wps) => wps.map((w, i) => (i === idx ? { ...w, position: newPos } : w)));
        },
      }}
    >
      <Popup>
        <div className="space-y-1">
          <div className="text-sm font-medium">{wp.label?.trim() || `Waypoint ${idx + 1}`}</div>
          <div className="text-xs text-gray-600">Lat: {wp.position[0].toFixed(5)}</div>
          <div className="text-xs text-gray-600">Lng: {wp.position[1].toFixed(5)}</div>
        </div>
      </Popup>
    </Marker>
  ));
}

export default WaypointMarkers;
