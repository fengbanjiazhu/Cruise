import { MapContainer, TileLayer } from "react-leaflet";
import WaypointMarkers from "../components/Paths/WaypointMarkers";
import RouteBetweenWaypoints from "../components/Paths/RouteBetweenWaypoints";

function MapWithRoute({ waypoints, profile }) {
  // Convert waypoints to expected format for WaypointMarkers/RouteBetweenWaypoints
  const formattedWaypoints = waypoints.map((wp, idx) => ({
    id: wp.id || idx,
    position: [wp.lat, wp.lng],
    label: wp.label || `Waypoint ${idx + 1}`,
  }));
  return (
    <MapContainer
      center={formattedWaypoints[0]?.position || [0,0]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", background: "#18181b" }}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <WaypointMarkers waypoints={formattedWaypoints} setWaypoints={() => {}} />
      <RouteBetweenWaypoints waypoints={formattedWaypoints} profile={profile} scenic={false} />
    </MapContainer>
  );
}

import React, { useState, useEffect } from "react";
import { fetchGet } from "../utils/api";

  function AllPaths() {
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const [openPathIds, setOpenPathIds] = useState([]);

    useEffect(() => {
      async function fetchPaths() {
        setLoading(true);
        setError(null);
        try {
          const res = await fetchGet("path", {});
          setPaths(res.data.data || []);
        } catch (err) {
          setError(err.message || "Failed to fetch paths");
        } finally {
          setLoading(false);
        }
      }
      fetchPaths();
    }, []);

    const handleTogglePath = (pathId) => {
      setOpenPathIds((ids) =>
        ids.includes(pathId) ? ids.filter((id) => id !== pathId) : [...ids, pathId]
      );
    };

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg,#101014 0%,#18181b 100%)',
      }}>
        <h1
          style={{
            fontSize: '2.6rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fff',
            marginTop: '2.5rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            textShadow: '0 2px 12px #18181b',
          }}
        >
          User Created Paths
        </h1>
        <table style={{
          width: '100%',
          maxWidth: '1100px',
          borderCollapse: 'separate',
          borderSpacing: 0,
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 2px 24px 0 rgba(0,0,0,0.32)',
          background: 'rgba(24,24,27,0.98)',
          marginTop: '0.5rem',
          color: '#e5e7eb',
          border: '1px solid #232326',
        }}>
          <thead style={{background: 'linear-gradient(90deg,#232326 0%,#18181b 100%)', color: '#a5b4fc'}}>
            <tr>
              <th style={{padding: '1rem', fontWeight: 700, textAlign: 'left', letterSpacing: '0.01em'}}>Name</th>
              <th style={{padding: '1rem', fontWeight: 700, textAlign: 'left', letterSpacing: '0.01em'}}>Profile</th>
              <th style={{padding: '1rem', fontWeight: 700, textAlign: 'left', letterSpacing: '0.01em'}}>Description</th>
              <th style={{padding: '1rem', fontWeight: 700, textAlign: 'left', letterSpacing: '0.01em'}}>Duration</th>
              <th style={{padding: '1rem', fontWeight: 700, textAlign: 'left', letterSpacing: '0.01em'}}>Creator</th>
              <th style={{padding: '1rem'}}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{padding: '2rem', textAlign: 'center', color: '#fff'}}>Loading paths…</td></tr>
            ) : error ? (
              <tr><td colSpan={6} style={{padding: '2rem', textAlign: 'center', color: '#fff'}}>{error}</td></tr>
            ) : paths.length === 0 ? (
              <tr><td colSpan={6} style={{padding: '2rem', textAlign: 'center', color: '#fff'}}>No paths found.</td></tr>
            ) : (
              paths.map((path, idx) => (
                <React.Fragment key={path._id}>
                  <tr style={{background: idx % 2 === 0 ? 'rgba(35,35,38,0.98)' : 'rgba(24,24,27,0.98)', transition: 'background 0.2s'}} onMouseEnter={e => e.currentTarget.style.background='#323248'} onMouseLeave={e => e.currentTarget.style.background=idx % 2 === 0 ? 'rgba(35,35,38,0.98)' : 'rgba(24,24,27,0.98)'}>
                    <td style={{padding: '1rem', fontWeight: 500}}>{path.name}</td>
                    <td style={{padding: '1rem'}}>{path.profile?.charAt(0).toUpperCase() + path.profile?.slice(1)}</td>
                    <td style={{padding: '1rem'}}>{path.description || "No description."}</td>
                    <td style={{padding: '1rem'}}>{path.duration} min</td>
                    <td style={{padding: '1rem'}}>{path.creator?.name || "Unknown"}</td>
                    <td style={{padding: '1rem'}}>
                      <button onClick={() => handleTogglePath(path._id)} style={{padding: '0.5rem 1.2rem', borderRadius: '0.75rem', background: openPathIds.includes(path._id) ? '#444' : '#222', color: '#fff', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 1px 4px 0 rgba(0,0,0,0.18)'}}>
                        {openPathIds.includes(path._id) ? 'Close preview' : 'Quick view'}
                      </button>
                    </td>
                  </tr>
                  {openPathIds.includes(path._id) && (
                    <tr>
                      <td colSpan={6} style={{background: 'linear-gradient(90deg,#232326 0%,#18181b 100%)', padding: '0', borderRadius: '0 0 1rem 1rem', borderTop: '1px solid #232326'}}>
                        {/* Only show the map for quick view */}
                        {Array.isArray(path.waypoints) && path.waypoints.length >= 2 && (
                          <div
                            style={{
                              minHeight: '220px',
                              height: 'clamp(220px, 40vw, 340px)',
                              width: '100%',
                              borderRadius: '1rem',
                              overflow: 'hidden',
                              boxShadow: '0 2px 24px 0 rgba(0,0,0,0.32)',
                              margin: '0',
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(24,24,27,0.98)',
                              padding: '0.5rem',
                              border: '1px solid #232326',
                            }}
                          >
                            <MapWithRoute waypoints={path.waypoints} profile={path.profile} />
                            <div
                              style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                zIndex: 1000,
                                pointerEvents: 'auto',
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '0.5rem',
                              }}
                            >
                              <a
                                href={`/path/${path._id}`}
                                style={{
                                  padding: '0.5rem 1.2rem',
                                  borderRadius: '0.75rem',
                                  background: 'linear-gradient(90deg,#6366f1 0%,#60a5fa 100%)',
                                  color: '#fff',
                                  fontWeight: 600,
                                  border: 'none',
                                  textDecoration: 'none',
                                  boxShadow: '0 1px 8px 0 rgba(99,102,241,0.18)',
                                  fontSize: '1rem',
                                  position: 'relative',
                                  zIndex: 1001,
                                  transition: 'background 0.2s, box-shadow 0.2s',
                                  cursor: 'pointer',
                                  outline: 'none',
                                }}
                                onMouseOver={e => {
                                  e.currentTarget.style.background = 'linear-gradient(90deg,#60a5fa 0%,#6366f1 100%)';
                                  e.currentTarget.style.boxShadow = '0 2px 12px 0 rgba(99,102,241,0.28)';
                                }}
                                onMouseOut={e => {
                                  e.currentTarget.style.background = 'linear-gradient(90deg,#6366f1 0%,#60a5fa 100%)';
                                  e.currentTarget.style.boxShadow = '0 1px 8px 0 rgba(99,102,241,0.18)';
                                }}
                                tabIndex={0}
                              >
                                Explore Full Path
                              </a>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  export default AllPaths;
