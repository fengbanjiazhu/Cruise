import { MapContainer, TileLayer } from "react-leaflet";
import WaypointMarkers from "../components/Paths/WaypointMarkers";
import RouteBetweenWaypoints from "../components/Paths/RouteBetweenWaypoints";
import Loading from "../components/UI/Loading";

const th_style = {
  padding: "0.85rem",
  fontWeight: 600,
  textAlign: "left",
  letterSpacing: "0.01em",
};

const tr_style = { padding: "2rem", textAlign: "center", color: "#fff" };
function MapWithRoute({ waypoints, profile }) {
  // Convert waypoints to expected format for WaypointMarkers/RouteBetweenWaypoints
  const formattedWaypoints = waypoints.map((wp, idx) => ({
    id: wp.id || idx,
    position: [wp.lat, wp.lng],
    label: wp.label || `Waypoint ${idx + 1}`,
  }));
  return (
    <MapContainer
      center={formattedWaypoints[0]?.position || [0, 0]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", background: "#fff" }}
      attributionControl={false}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        attribution="&copy; Stadia Maps, &copy; OpenMapTiles &copy; OpenStreetMap contributors"
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

  if (loading) return <Loading classNames="w-[900px]" />;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        background: "#f7f7fa",
        padding: "0 1rem",
      }}
    >
      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: "#222",
          marginTop: "2.5rem",
          marginBottom: "1.5rem",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        User Created Paths
      </h1>
      <table
        style={{
          width: "100%",
          maxWidth: "900px",
          borderCollapse: "separate",
          borderSpacing: 0,
          borderRadius: "0.75rem",
          overflow: "hidden",
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
          background: "#fff",
          marginTop: "0.5rem",
          color: "#222",
          border: "1px solid #ececf0",
        }}
      >
        <thead style={{ background: "#f7f7fa", color: "#555", borderBottom: "1px solid #ececf0" }}>
          <tr>
            <th style={th_style}>Name</th>
            <th style={th_style}>Profile</th>
            <th style={th_style}>Description</th>
            <th style={th_style}>Duration</th>
            <th style={th_style}>Creator</th>
            <th style={{ padding: "0.85rem" }}></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} style={tr_style}>
                Loading paths…
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} style={tr_style}>
                {error}
              </td>
            </tr>
          ) : paths.length === 0 ? (
            <tr>
              <td colSpan={6} style={tr_style}>
                No paths found.
              </td>
            </tr>
          ) : (
            paths.map((path, idx) => (
              <React.Fragment key={path._id}>
                <tr
                  style={{
                    background: idx % 2 === 0 ? "#f7f7fa" : "#fff",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#ececf0")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = idx % 2 === 0 ? "#f7f7fa" : "#fff")
                  }
                >
                  <td style={{ padding: "0.85rem", fontWeight: 500, color: "#222" }}>
                    {path.name}
                  </td>
                  <td style={{ padding: "0.85rem", color: "#555" }}>
                    {path.profile?.charAt(0).toUpperCase() + path.profile?.slice(1)}
                  </td>
                  <td style={{ padding: "0.85rem", color: "#555" }}>
                    {path.description || "No description."}
                  </td>
                  <td style={{ padding: "0.85rem", color: "#555" }}>{path.duration} min</td>
                  <td style={{ padding: "0.85rem", color: "#555" }}>
                    {path.creator?.name || "Unknown"}
                  </td>
                  <td style={{ padding: "0.85rem" }}>
                    <button
                      onClick={() => handleTogglePath(path._id)}
                      style={{
                        padding: "0.45rem 1.1rem",
                        borderRadius: "0.6rem",
                        background: openPathIds.includes(path._id) ? "#ececf0" : "#f7f7fa",
                        color: "#222",
                        fontWeight: 500,
                        border: "1px solid #ececf0",
                        cursor: "pointer",
                        boxShadow: "none",
                        fontSize: "0.98rem",
                        transition: "background 0.2s, border 0.2s",
                      }}
                    >
                      {openPathIds.includes(path._id) ? "Close preview" : "Quick view"}
                    </button>
                  </td>
                </tr>
                {openPathIds.includes(path._id) && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        background: "#f7f7fa",
                        padding: "0",
                        borderRadius: "0 0 0.75rem 0.75rem",
                        borderTop: "1px solid #ececf0",
                      }}
                    >
                      {/* Only show the map for quick view */}
                      {Array.isArray(path.waypoints) && path.waypoints.length >= 2 && (
                        <div
                          style={{
                            minHeight: "220px",
                            height: "clamp(220px, 40vw, 340px)",
                            width: "100%",
                            borderRadius: "0.75rem",
                            overflow: "hidden",
                            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
                            margin: "0",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#fff",
                            padding: "0.5rem",
                            border: "1px solid #ececf0",
                          }}
                        >
                          <MapWithRoute waypoints={path.waypoints} profile={path.profile} />
                          <div
                            style={{
                              position: "absolute",
                              top: "1rem",
                              right: "1rem",
                              zIndex: 1000,
                              pointerEvents: "auto",
                              display: "flex",
                              flexDirection: "row",
                              gap: "0.5rem",
                            }}
                          >
                            <a
                              href={`/path/${path._id}`}
                              style={{
                                padding: "0.5rem 1.2rem",
                                borderRadius: "0.6rem",
                                background: "#ececf0",
                                color: "#222",
                                fontWeight: 500,
                                border: "1px solid #ececf0",
                                textDecoration: "none",
                                boxShadow: "none",
                                fontSize: "0.98rem",
                                position: "relative",
                                zIndex: 1001,
                                transition: "background 0.2s, border 0.2s",
                                cursor: "pointer",
                                outline: "none",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "#f7f7fa";
                                e.currentTarget.style.border = "1px solid #d1d5db";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "#ececf0";
                                e.currentTarget.style.border = "1px solid #ececf0";
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
