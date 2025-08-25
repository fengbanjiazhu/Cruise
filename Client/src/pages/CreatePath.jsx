
import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { v4 as uuidv4 } from "uuid";
import "leaflet/dist/leaflet.css";

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
          setWaypoints((wps) =>
            wps.map((w, i) =>
              i === idx ? { ...w, position: newPos } : w
            )
          );
        },
      }}
    >
      <Popup>
        Waypoint {idx + 1}
        <br />
        Lat: {wp.position[0].toFixed(5)}
        <br />
        Lng: {wp.position[1].toFixed(5)}
      </Popup>
    </Marker>
  ));
}

function AddWaypointOnClick({ addWaypoint }) {
  useMapEvents({
    click(e) {
      addWaypoint([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function CreatePath() {
  const [routeName, setRouteName] = useState("");
  const [description, setDescription] = useState("");
  const [waypoints, setWaypoints] = useState([]);
  const [pendingLatLng, setPendingLatLng] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const mapRef = useRef();

  // Add a waypoint at position
  const addWaypoint = (latlng) => {
    setWaypoints((wps) => [
      ...wps,
      { id: uuidv4(), position: latlng },
    ]);
    setPendingLatLng(null);
  };

  // Remove a waypoint by index
  const removeWaypoint = (idx) => {
    setWaypoints((wps) => wps.filter((_, i) => i !== idx));
  };

  // Move waypoint up/down in list
  const moveWaypoint = (idx, dir) => {
    setWaypoints((wps) => {
      const arr = [...wps];
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= arr.length) return arr;
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return arr;
    });
  };

  // Form validation
  const validate = () => {
    const errs = {};
    if (!routeName.trim()) errs.routeName = "Route name is required";
    if (waypoints.length < 2)
      errs.waypoints = "At least 2 waypoints are required";
    return errs;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setFormErrors(errs);
    if (Object.keys(errs).length === 0) {
      setShowPreview(true);
    }
  };

  // Handle map click: set pending waypoint position
  const handleMapClick = (e) => {
    setPendingLatLng([e.latlng.lat, e.latlng.lng]);
  };

  // Custom map events for adding waypoint with confirmation popup
  function PendingWaypointHandler() {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1>Create Path</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Route Name:{" "}
            <input
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              style={{ width: 250 }}
            />
          </label>
          {formErrors.routeName && (
            <span style={{ color: "red", marginLeft: 8 }}>
              {formErrors.routeName}
            </span>
          )}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Description:{" "}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              style={{ width: 350 }}
            />
          </label>
        </div>
        <div>
          <strong>Waypoints:</strong>
          {formErrors.waypoints && (
            <span style={{ color: "red", marginLeft: 8 }}>
              {formErrors.waypoints}
            </span>
          )}
          <ol>
            {waypoints.map((wp, idx) => (
              <li key={wp.id} style={{ marginBottom: 4 }}>
                <span>
                  <b>Waypoint {idx + 1}:</b>{" "}
                  {wp.position[0].toFixed(5)}, {wp.position[1].toFixed(5)}
                </span>
                <button
                  type="button"
                  onClick={() => removeWaypoint(idx)}
                  style={{ marginLeft: 8 }}
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => moveWaypoint(idx, -1)}
                  disabled={idx === 0}
                  style={{ marginLeft: 4 }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveWaypoint(idx, 1)}
                  disabled={idx === waypoints.length - 1}
                  style={{ marginLeft: 2 }}
                >
                  ↓
                </button>
              </li>
            ))}
          </ol>
          <div style={{ color: "#555", fontSize: 13 }}>
            Click on the map to add a waypoint.
          </div>
        </div>
        <button type="submit" style={{ marginTop: 20 }}>
          Preview JSON
        </button>
      </form>
      <div style={{ height: 400, marginBottom: 24 }}>
        <MapContainer
          center={waypoints[0]?.position || [51.505, -0.09]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <WaypointMarkers waypoints={waypoints} setWaypoints={setWaypoints} />
          <PendingWaypointHandler />
          {pendingLatLng && (
            <Marker position={pendingLatLng}>
              <Popup
                position={pendingLatLng}
                closeButton={false}
                closeOnClick={false}
                autoClose={false}
                autoPan={false}
              >
                <div>
                  <div>
                    Add waypoint here? <br />
                    <button
                      type="button"
                      onClick={() => addWaypoint(pendingLatLng)}
                      style={{ marginRight: 6 }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingLatLng(null)}
                    >
                      No
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      {showPreview && (
        <div style={{
          background: "#f4f4f4",
          border: "1px solid #ccc",
          padding: 16,
          borderRadius: 6,
        }}>
          <h3>JSON Preview</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(
              {
                name: routeName,
                description,
                waypoints: waypoints.map((wp) => ({
                  lat: wp.position[0],
                  lng: wp.position[1],
                })),
              },
              null,
              2
            )}
          </pre>
          <button onClick={() => setShowPreview(false)}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default CreatePath;
