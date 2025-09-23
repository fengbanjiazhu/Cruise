import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import WaypointMarkers from "../components/Paths/WaypointMarkers";
import RouteBetweenWaypoints from "../components/Paths/RouteBetweenWaypoints";
import { fetchGet } from "../utils/api";


function PathDetail() {
  const { pathID } = useParams();
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routeSteps, setRouteSteps] = useState(null);
  const [cardVisible, setCardVisible] = useState(true);

  useEffect(() => {
    async function fetchPath() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchGet(`path/${pathID}`, {});
  console.log('Fetched path JSON:', res.data.data);
  setPath(res.data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch path");
      } finally {
        setLoading(false);
      }
    }
    fetchPath();
  }, [pathID]);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">Loading path…</div>;
  if (error) return <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 text-red-600">{error}</div>;
  if (!path) return <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">No path found.</div>;

  return (
    <div style={{width: '100vw', height: '100vh', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', overflow: 'hidden'}}>
      {/* Overlay card in top left */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          right: 32,
          zIndex: 1000,
          maxWidth: 400,
          width: '90vw',
          transition: 'transform 0.4s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.3s',
          transform: cardVisible ? 'translateX(0)' : 'translateX(120%)',
          opacity: cardVisible ? 1 : 0,
          pointerEvents: cardVisible ? 'auto' : 'none',
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          borderRadius: '12px',
          border: 'none',
          padding: '2rem',
          fontFamily: 'Inter, sans-serif',
        }}
        className="text-gray-900"
      >
        <button
          onClick={() => setCardVisible(false)}
          style={{position: 'absolute', top: 18, right: 18, zIndex: 1010, background: 'none', border: 'none', fontSize: '1.5rem', color: '#888', cursor: 'pointer', padding: 0}}
          aria-label="Hide details"
        >
          ×
        </button>
        <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: '#222'}}>{path.name}</h2>
        <p style={{marginBottom: '1.2rem', color: '#555', fontSize: '1rem'}}>{path.description}</p>
        <div style={{display: 'flex', gap: '1.2rem', marginBottom: '1.2rem'}}>
          <div style={{fontSize: '0.95rem', color: '#666'}}><span style={{fontWeight: 500, color: '#888'}}>Profile:</span> {path.profile}</div>
          <div style={{fontSize: '0.95rem', color: '#666'}}><span style={{fontWeight: 500, color: '#888'}}>Duration:</span> {path.duration} min</div>
          <div style={{fontSize: '0.95rem', color: '#666'}}><span style={{fontWeight: 500, color: '#888'}}>Creator:</span> {path.creator?.name || "Unknown"}</div>
          <div style={{fontSize: '0.95rem', color: '#666'}}><span style={{fontWeight: 500, color: '#888'}}>Waypoints:</span> {Array.isArray(path.waypoints) ? path.waypoints.length : 0}</div>
        </div>
        {Array.isArray(path.waypoints) && path.waypoints.length > 0 && (
          <ul style={{marginTop: '0.5rem', padding: 0, listStyle: 'none'}}>
            {path.waypoints.map((wp, idx) => (
              <li key={idx} style={{padding: '0.5rem 0', borderBottom: '1px solid #eee', fontSize: '0.98rem', color: '#444', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontWeight: 500}}>{idx + 1}. {wp.label?.trim() || `Waypoint ${idx + 1}`}</span>
                <span style={{fontSize: '0.92rem', color: '#888'}}>{wp.lat?.toFixed(6)}, {wp.lng?.toFixed(6)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Toggle button when card is hidden */}
      {!cardVisible && (
        <button
          onClick={() => setCardVisible(true)}
          style={{position: 'absolute', top: 32, right: 32, zIndex: 1000}}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-blue-800"
          aria-label="Show details"
        >
          Show Details
        </button>
      )}
      {/* Fullscreen map */}
      <div style={{width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 1}}>
        {Array.isArray(path.locations) && path.locations.length > 0 && (
          <MapContainer
            center={(() => {
              const mid = Math.floor(path.locations.length / 2);
              return [path.locations[mid].lat, path.locations[mid].lng];
            })()}
            zoom={14}
            scrollWheelZoom
            className="h-full w-full"
            style={{height: '100%', width: '100%'}}
            whenCreated={map => {
              if (Array.isArray(path.locations) && path.locations.length > 0) {
                const bounds = path.locations.map(loc => [loc.lat, loc.lng]);
                // Add extra padding to top and right to avoid card overlap
                map.fitBounds(bounds, { paddingTopLeft: [400, 120], paddingBottomRight: [40, 40] });
              }
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Show waypoints as markers */}
            <WaypointMarkers waypoints={path.waypoints.map(wp => ({
              ...wp,
              position: [wp.lat, wp.lng]
            }))} setWaypoints={null} />
            {/* Draw route as a polyline using locations */}
            {path.locations.length > 1 && (
              <Polyline
                positions={path.locations.map(loc => [loc.lat, loc.lng])}
                pathOptions={{ color: "#111827", weight: 5, opacity: 0.95 }}
              />
            )}
          </MapContainer>
        )}
      </div>
      <p className="mt-2 text-sm text-gray-500 text-center" style={{position: 'absolute', bottom: 24, left: 0, width: '100%', zIndex: 1002}}>
        Tip: waypoints and route are shown as on creation. Dragging is disabled.
      </p>
    </div>
  );
}

export default PathDetail;
