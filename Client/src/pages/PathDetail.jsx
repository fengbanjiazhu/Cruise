import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Polyline, useMapEvents } from "react-leaflet";
import WaypointMarkers from "../components/Paths/WaypointMarkers";
import RouteBetweenWaypoints from "../components/Paths/RouteBetweenWaypoints";
import { fetchGet } from "../utils/api";
import { FaAngleRight } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { fetchPost, optionMaker } from "../utils/api";

function PathDetail() {
  const { user: currentUser, token } = useSelector((state) => state.userInfo);
  const { pathID } = useParams();
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routeSteps, setRouteSteps] = useState(null);
  const [cardVisible, setCardVisible] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  // Edit modal states
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editWaypoints, setEditWaypoints] = useState([]);
  const [editProfile, setEditProfile] = useState("foot");
  const [editScenic, setEditScenic] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (showEditModal && path) {
      setEditName(path.name || "");
      setEditDescription(path.description || "");
      setEditWaypoints(
        Array.isArray(path.waypoints)
          ? path.waypoints.map((wp) => ({
              ...wp,
              position: [wp.lat, wp.lng],
            }))
          : []
      );
      setEditProfile(path.profile || "foot");
      setEditScenic(true); // default true, adjust if path has scenic info
    }
  }, [showEditModal, path]);

  useEffect(() => {
    async function fetchPath() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchGet(`path/${pathID}`, {});
        console.log("Fetched path JSON:", res.data.data);
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
  const isCreator = currentUser && path.creator && currentUser._id === path.creator._id;

  console.log(
    "Is current user the creator of this path?",
    isCreator,
    "\nCurrent user:",
    currentUser,
    "\nPath creator:",
    path.creator
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        overflow: "hidden",
      }}
    >
      {/* App navigation button - more prominent */}
      <Link
        to="/allpaths"
        className="absolute top-4 left-12 z-[900] flex items-center gap-2.5 px-[1.3rem] py-[0.6rem] rounded-[0.8rem] bg-white text-[#222] font-semibold border border-[#ececf0] cursor-pointer shadow-[0_2px_12px_0_rgba(99,102,241,0.10)] text-[1.08rem] no-underline tracking-[0.01em] transition-colors duration-200"
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#f7f7fa";
          e.currentTarget.style.border = "1px solid #d1d5db";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.border = "1px solid #ececf0";
        }}
        aria-label="View all paths"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "inline", verticalAlign: "middle" }}
        >
          <path
            d="M18 11H4M4 11L9.5 5.5M4 11L9.5 16.5"
            stroke="#222"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        View all paths
      </Link>
      {/* Overlay card in top left */}
      <div
        className="text-gray-900 absolute top-8 right-8 z-[900] max-w-[400px] w-[90vw] bg-[rgba(255,255,255,0.95)] shadow-[0_4px_24px_rgba(0,0,0,0.08)] rounded-[12px] border-0 p-8 font-sans transition-transform transition-opacity duration-300"
        style={{
          transition: "transform 0.4s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.3s",
          transform: cardVisible ? "translateX(0)" : "translateX(120%)",
          opacity: cardVisible ? 1 : 0,
          pointerEvents: cardVisible ? "auto" : "none",
        }}
      >
        <div className="flex gap-1 items-center justify-between mb-1">
          <button
            onClick={() => setCardVisible(false)}
            className="z-[1010] bg-none border-0 text-[1.7rem] text-[#888] cursor-pointer p-0 flex items-center"
            aria-label="Slide details away"
            title="Slide details away"
          >
            <FaAngleRight className="px-1" />
          </button>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#222" }}>{path.name}</h2>
        </div>
        <p style={{ marginBottom: "1.2rem", color: "#555", fontSize: "1rem" }}>
          {path.description}
        </p>
        <div style={{ display: "flex", gap: "1.2rem", marginBottom: "1.2rem" }}>
          <div style={{ fontSize: "0.95rem", color: "#666" }}>
            <span style={{ fontWeight: 500, color: "#888" }}>Profile:</span> {path.profile}
          </div>
          <div style={{ fontSize: "0.95rem", color: "#666" }}>
            <span style={{ fontWeight: 500, color: "#888" }}>Duration:</span> {path.duration} min
          </div>
          <div style={{ fontSize: "0.95rem", color: "#666" }}>
            <span style={{ fontWeight: 500, color: "#888" }}>Creator:</span>{" "}
            {path.creator?.name || "Unknown"}
          </div>
          <div style={{ fontSize: "0.95rem", color: "#666" }}>
            <span style={{ fontWeight: 500, color: "#888" }}>Waypoints:</span>{" "}
            {Array.isArray(path.waypoints) ? path.waypoints.length : 0}
          </div>
        </div>
        {Array.isArray(path.waypoints) && path.waypoints.length > 0 && (
          <ul style={{ marginTop: "0.5rem", padding: 0, listStyle: "none" }}>
            {path.waypoints.map((wp, idx) => (
              <li
                key={idx}
                style={{
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #eee",
                  fontSize: "0.98rem",
                  color: "#444",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 500 }}>
                  {idx + 1}. {wp.label?.trim() || `Waypoint ${idx + 1}`}
                </span>
                <span style={{ fontSize: "0.92rem", color: "#888" }}>
                  {wp.lat?.toFixed(6)}, {wp.lng?.toFixed(6)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {/* Button section at bottom of card for creator */}
        {isCreator && (
          <div
            style={{
              width: "100%",
              padding: "1.1rem 0 0.7rem 0",
              marginTop: "1.2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.7rem",
              background: "none",
              borderRadius: "0 0 12px 12px",
            }}
          >
            <span
              style={{
                fontSize: "1rem",
                color: "#444",
                fontWeight: 700,
                letterSpacing: "0.01em",
                display: "block",
                marginBottom: "0.7rem",
              }}
            >
              You created this path
            </span>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <button
                style={{
                  background: "#fff",
                  color: "#2563eb",
                  border: "1.5px solid #2563eb",
                  borderRadius: "6px",
                  fontSize: "0.98rem",
                  fontWeight: 500,
                  padding: "0.45rem 1.1rem",
                  cursor: "pointer",
                  boxShadow: "none",
                  letterSpacing: "0.01em",
                  transition: "background 0.2s, color 0.2s, border 0.2s",
                }}
                onClick={() => setShowEditModal(true)}
                aria-label="Edit Path"
              >
                Edit
              </button>
              <button
                style={{
                  background: "#fff",
                  color: "#dc2626",
                  border: "1.5px solid #dc2626",
                  borderRadius: "6px",
                  fontSize: "0.98rem",
                  fontWeight: 500,
                  padding: "0.45rem 1.1rem",
                  cursor: "pointer",
                  boxShadow: "none",
                  letterSpacing: "0.01em",
                  transition: "background 0.2s, color 0.2s, border 0.2s",
                }}
                onClick={async () => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this path? This action cannot be undone."
                    )
                  ) {
                    try {
                      // const res = await fetch(`/api/path/${pathID}`, {
                      //   method: "DELETE",
                      // });
                      await fetchPost(`path/${pathID}`, optionMaker({ pathID }, "DELETE", token));
                      // if (!res.ok) {
                      //   const err = await res.json();
                      //   toast.error(
                      //     "Failed to delete path: " +
                      //       (err.errors ? err.errors.join(", ") : err.message)
                      //   );
                      // } else {
                      toast.success("Path deleted successfully!");
                      navigate("/allpaths");
                      // window.location.href = "/allpaths";
                      // }
                    } catch (err) {
                      console.log(err);
                      toast.error("Error deleting path: " + err.message);
                    }
                  }
                }}
                aria-label="Delete Path"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Toggle button when card is hidden */}
      {!cardVisible && (
        <button
          onClick={() => setCardVisible(true)}
          style={{
            position: "absolute",
            top: 32,
            right: 32,
            zIndex: 1000,
            padding: "0.45rem 1.1rem",
            borderRadius: "0.6rem",
            background: "#ececf0",
            color: "#222",
            fontWeight: 500,
            border: "1px solid #ececf0",
            cursor: "pointer",
            boxShadow: "none",
            fontSize: "0.98rem",
            transition: "background 0.2s, border 0.2s",
          }}
          aria-label="Show details"
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#f7f7fa";
            e.currentTarget.style.border = "1px solid #d1d5db";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#ececf0";
            e.currentTarget.style.border = "1px solid #ececf0";
          }}
        >
          Show Details
        </button>
      )}
      {/* Fullscreen map */}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        {Array.isArray(path.locations) && path.locations.length > 0 && (
          <MapContainer
            center={(() => {
              const mid = Math.floor(path.locations.length / 2);
              return [path.locations[mid].lat, path.locations[mid].lng];
            })()}
            zoom={14}
            scrollWheelZoom
            className="h-full w-full"
            style={{ height: "100%", width: "100%" }}
            whenCreated={(map) => {
              if (Array.isArray(path.locations) && path.locations.length > 0) {
                const bounds = path.locations.map((loc) => [loc.lat, loc.lng]);
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
            <WaypointMarkers
              waypoints={path.waypoints.map((wp) => ({
                ...wp,
                position: [wp.lat, wp.lng],
              }))}
              setWaypoints={null}
            />
            {/* Draw route as a polyline using locations */}
            {path.locations.length > 1 && (
              <Polyline
                positions={path.locations.map((loc) => [loc.lat, loc.lng])}
                pathOptions={{ color: "#111827", weight: 5, opacity: 0.95 }}
              />
            )}
          </MapContainer>
        )}
      </div>
      <p
        className="mt-2 text-sm text-gray-500 text-center"
        style={{ position: "absolute", bottom: 24, left: 0, width: "100%", zIndex: 1002 }}
      >
        Tip: waypoints and route are shown as on creation. Dragging is disabled.
      </p>

      {/* Edit Modal Popup */}
      {showEditModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.45)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "1.25rem",
              padding: "2.5rem 2rem",
              minWidth: "340px",
              maxWidth: "95vw",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <button
              onClick={() => setShowEditModal(false)}
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                background: "none",
                border: "none",
                fontSize: "2rem",
                color: "#888",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label="Close Edit Modal"
            >
              &times;
            </button>
            <h3
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
                color: "#222",
                letterSpacing: "0.01em",
              }}
            >
              Edit Path
            </h3>
            <form style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {/* ...existing code... */}
              <div>
                <label
                  htmlFor="editName"
                  style={{
                    fontWeight: 600,
                    fontSize: "1.08rem",
                    color: "#222",
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  Route name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  id="editName"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Coastal Sunrise Run"
                  style={{
                    marginTop: 6,
                    width: "100%",
                    borderRadius: "0.7rem",
                    border: "1.5px solid #bbb",
                    padding: "0.7rem",
                    fontSize: "1.08rem",
                    background: "#fafbfc",
                    color: "#222",
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="editDescription"
                  style={{
                    fontWeight: 600,
                    fontSize: "1.08rem",
                    color: "#222",
                    marginBottom: 4,
                    display: "block",
                  }}
                >
                  Description
                </label>
                <textarea
                  id="editDescription"
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Short description for this path"
                  style={{
                    marginTop: 6,
                    width: "100%",
                    borderRadius: "0.7rem",
                    border: "1.5px solid #bbb",
                    padding: "0.7rem",
                    fontSize: "1.08rem",
                    background: "#fafbfc",
                    color: "#222",
                  }}
                />
              </div>
              <div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: 4 }}
                >
                  <span style={{ fontWeight: 600, fontSize: "1.08rem", color: "#222" }}>
                    Waypoints
                  </span>
                  <span
                    style={{
                      background: "#f3f4f6",
                      borderRadius: "1rem",
                      padding: "0.2rem 0.7rem",
                      fontSize: "1rem",
                      color: "#222",
                    }}
                  >
                    {editWaypoints.length}
                  </span>
                </div>
                {editWaypoints.length === 0 ? (
                  <p style={{ marginTop: 8, fontSize: "1.05rem", color: "#888" }}>
                    No waypoints. (Editing waypoints in modal is not supported yet)
                  </p>
                ) : (
                  <ul style={{ marginTop: 10, listStyle: "none", padding: 0 }}>
                    {editWaypoints.map((wp, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "1rem",
                          border: "1.5px solid #e5e7eb",
                          borderRadius: "0.7rem",
                          padding: "0.9rem",
                          marginBottom: 10,
                          background: "#fafbfc",
                        }}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: "1.08rem",
                              marginBottom: 2,
                              color: "#222",
                            }}
                          >
                            {idx + 1}. {wp.label?.trim() || `Waypoint ${idx + 1}`}
                          </div>
                          <div style={{ fontSize: "1rem", color: "#666", marginBottom: 4 }}>
                            {wp.lat?.toFixed(6)}, {wp.lng?.toFixed(6)}
                          </div>
                          <label
                            style={{
                              fontSize: "0.95rem",
                              color: "#444",
                              marginBottom: 2,
                              display: "block",
                            }}
                          >
                            Rename
                          </label>
                          <input
                            type="text"
                            value={wp.label || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditWaypoints((wps) =>
                                wps.map((w, i) => (i === idx ? { ...w, label: val } : w))
                              );
                            }}
                            placeholder={`Waypoint ${idx + 1}`}
                            style={{
                              width: "100%",
                              borderRadius: "0.5rem",
                              border: "1.5px solid #bbb",
                              padding: "0.5rem",
                              fontSize: "1rem",
                              background: "#fff",
                              color: "#222",
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          style={{
                            marginLeft: 12,
                            borderRadius: "0.5rem",
                            border: "1.5px solid #dc2626",
                            background: "#fff",
                            color: "#dc2626",
                            fontWeight: 500,
                            padding: "0.5rem 1.1rem",
                            fontSize: "1rem",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (
                              window.confirm("Delete this waypoint? This will reset the route.")
                            ) {
                              setEditWaypoints((wps) => wps.filter((_, i) => i !== idx));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Editable Map in Popup - moved below waypoints, above routing profile */}
              <div
                style={{
                  width: "100%",
                  height: "320px",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  marginBottom: "1.2rem",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <MapContainer
                  center={editWaypoints[0]?.position || [-33.8688, 151.2093]}
                  zoom={13}
                  scrollWheelZoom
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                    attribution="&copy; Stadia Maps, &copy; OpenMapTiles &copy; OpenStreetMap contributors"
                  />
                  <WaypointMarkers waypoints={editWaypoints} setWaypoints={setEditWaypoints} />
                  {/* Add waypoint on map click, like CreatePath */}
                  {(() => {
                    function AddWaypointOnClick() {
                      useMapEvents({
                        click: (e) => {
                          setEditWaypoints((wps) => [
                            ...wps,
                            {
                              id: Math.random().toString(36).slice(2),
                              position: [e.latlng.lat, e.latlng.lng],
                              label: `Waypoint ${wps.length + 1}`,
                              lat: e.latlng.lat,
                              lng: e.latlng.lng,
                            },
                          ]);
                        },
                      });
                      return null;
                    }
                    return <AddWaypointOnClick />;
                  })()}
                  <RouteBetweenWaypoints
                    waypoints={editWaypoints}
                    profile={editProfile}
                    scenic={editScenic}
                    handleSave={setRouteSteps}
                  />
                </MapContainer>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
                <div>
                  <label
                    style={{
                      fontWeight: 600,
                      fontSize: "1.08rem",
                      color: "#222",
                      marginBottom: 4,
                      display: "block",
                    }}
                  >
                    Routing profile
                  </label>
                  <select
                    style={{
                      marginTop: 6,
                      width: "100%",
                      borderRadius: "0.7rem",
                      border: "1.5px solid #bbb",
                      padding: "0.7rem",
                      fontSize: "1.08rem",
                      background: "#fafbfc",
                      color: "#222",
                    }}
                    value={editProfile}
                    onChange={(e) => setEditProfile(e.target.value)}
                  >
                    <option value="car">Driving</option>
                    <option value="bike">Cycling</option>
                    <option value="foot">Walking</option>
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                  <label
                    style={{ fontWeight: 600, fontSize: "1.08rem", color: "#222", marginRight: 8 }}
                  >
                    <input
                      type="checkbox"
                      checked={editScenic}
                      onChange={(e) => setEditScenic(e.target.checked)}
                      style={{ marginRight: 8 }}
                    />
                    Scenic mode (show alternatives)
                  </label>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    borderRadius: "0.7rem",
                    border: "1.5px solid #bbb",
                    background: "#fff",
                    color: "#222",
                    fontWeight: 600,
                    padding: "0.8rem 1.7rem",
                    fontSize: "1.08rem",
                    cursor: "pointer",
                    letterSpacing: "0.01em",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  style={{
                    borderRadius: "0.7rem",
                    border: "1.5px solid #2563eb",
                    background: "#2563eb",
                    color: "#fff",
                    fontWeight: 600,
                    padding: "0.8rem 1.7rem",
                    fontSize: "1.08rem",
                    cursor: "pointer",
                    letterSpacing: "0.01em",
                  }}
                  onClick={async () => {
                    console.log("routeSteps in PATCH handler:", routeSteps);
                    // Calculate distance and duration from routeSteps
                    let distance = null;
                    let duration = null;
                    if (routeSteps && routeSteps.summary) {
                      distance = routeSteps.summary.totalDistance;
                      duration = routeSteps.summary.totalTime;
                    }
                    const payload = {
                      name: editName,
                      description: editDescription,
                      profile: editProfile,
                      distance,
                      duration,
                      locations: editWaypoints.map((wp) => ({
                        lat: wp.position[0],
                        lng: wp.position[1],
                      })),
                      waypoints: editWaypoints.map((wp, i) => ({
                        label: wp.label && wp.label.trim() ? wp.label.trim() : `Waypoint ${i + 1}`,
                        lat: wp.position[0],
                        lng: wp.position[1],
                      })),
                    };
                    console.log("PATCH payload:", payload);
                    try {
                      const res = await fetchPost(
                        `path/${pathID}`,
                        optionMaker({ ...payload }, "PATCH", token)
                      );

                      // if (!res.ok) {
                      //   const err = await res.json();
                      //   toast.error(
                      //     "Failed to update path: " +
                      //       (err.errors ? err.errors.join(", ") : err.message)
                      //   );
                      // } else {
                      toast.success("Path updated successfully!");
                      setShowEditModal(false);
                      setPath(res.data.data);
                      // }
                    } catch (err) {
                      toast.error("Error updating path: " + err.message);
                    }
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PathDetail;
