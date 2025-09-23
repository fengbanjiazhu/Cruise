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
      {/* App navigation button - more prominent */}
      <a
        href="/allpaths"
        style={{
          position: 'absolute',
          top: 32,
          left: 32,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1.3rem',
          borderRadius: '0.8rem',
          background: '#fff',
          color: '#222',
          fontWeight: 600,
          border: '1px solid #ececf0',
          cursor: 'pointer',
          boxShadow: '0 2px 12px 0 rgba(99,102,241,0.10)',
          fontSize: '1.08rem',
          textDecoration: 'none',
          letterSpacing: '0.01em',
          transition: 'background 0.2s, box-shadow 0.2s, border 0.2s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.background = '#f7f7fa';
          e.currentTarget.style.border = '1px solid #d1d5db';
        }}
        onMouseOut={e => {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.border = '1px solid #ececf0';
        }}
        aria-label="View all paths"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'inline',verticalAlign:'middle'}}>
          <path d="M18 11H4M4 11L9.5 5.5M4 11L9.5 16.5" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        View all paths
      </a>
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
          style={{position: 'absolute', top: 18, right: 18, zIndex: 1010, background: 'none', border: 'none', fontSize: '1.7rem', color: '#888', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center'}}
          aria-label="Slide details away"
          title="Slide details away"
        >
          <span style={{display: 'inline-block', transform: 'rotate(0deg)', fontSize: '2rem', marginRight: '2px'}}>&#8594;</span>
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
          style={{
            position: 'absolute',
            top: 32,
            right: 32,
            zIndex: 1000,
            padding: '0.45rem 1.1rem',
            borderRadius: '0.6rem',
            background: '#ececf0',
            color: '#222',
            fontWeight: 500,
            border: '1px solid #ececf0',
            cursor: 'pointer',
            boxShadow: 'none',
            fontSize: '0.98rem',
            transition: 'background 0.2s, border 0.2s',
          }}
          aria-label="Show details"
          onMouseOver={e => {
            e.currentTarget.style.background = '#f7f7fa';
            e.currentTarget.style.border = '1px solid #d1d5db';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#ececf0';
            e.currentTarget.style.border = '1px solid #ececf0';
          }}
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
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
              attribution="&copy; Stadia Maps, &copy; OpenMapTiles &copy; OpenStreetMap contributors"
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
