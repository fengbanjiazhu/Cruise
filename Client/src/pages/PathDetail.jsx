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
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-black mb-4">Path Details</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left column: details card */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-gray-900">
            <h2 className="text-xl font-bold mb-2">{path.name}</h2>
            <p className="mb-2 text-gray-700">{path.description}</p>
            <div className="mb-2">
              <span className="font-semibold">Profile:</span> {path.profile}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Duration:</span> {path.duration} min
            </div>
            <div className="mb-2">
              <span className="font-semibold">Creator:</span> {path.creator?.name || "Unknown"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Waypoints:</span> {Array.isArray(path.waypoints) ? path.waypoints.length : 0}
            </div>
            {Array.isArray(path.waypoints) && path.waypoints.length > 0 && (
              <ul className="mt-2 space-y-2">
                {path.waypoints.map((wp, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {idx + 1}. {wp.label?.trim() || `Waypoint ${idx + 1}`}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {wp.lat?.toFixed(6)}, {wp.lng?.toFixed(6)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Right column: placeholder for map or additional info */}
        <div className="lg:col-span-3">
          <div className="h-[60vh] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm text-gray-900">
            {Array.isArray(path.locations) && path.locations.length > 0 && (
              <MapContainer
                center={[path.locations[0].lat, path.locations[0].lng]}
                zoom={14}
                scrollWheelZoom
                className="h-full w-full"
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
                  <>
                    <Polyline
                      positions={path.locations.map(loc => [loc.lat, loc.lng])}
                      pathOptions={{ color: "#111827", weight: 5, opacity: 0.95 }}
                    />
                  </>
                )}
              </MapContainer>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Tip: waypoints and route are shown as on creation. Dragging is disabled.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PathDetail;
