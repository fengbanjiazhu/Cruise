import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";

import RouteBetweenWaypoints from "../components/Paths/RouteBetweenWaypoints";
import WaypointMarkers from "../components/Paths/WaypointMarkers";
import { fetchPost, optionMaker } from "../utils/api";

function CreatePath() {
  const [routeName, setRouteName] = useState("");
  const [description, setDescription] = useState("");
  const [waypoints, setWaypoints] = useState([]);
  const [pendingLatLng, setPendingLatLng] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const mapRef = useRef();
  const [routeSteps, setRouteSteps] = useState(null);

  const [routingProfile, setRoutingProfile] = useState("foot"); // 'car' | 'bike' | 'foot'
  const [scenicMode, setScenicMode] = useState(true); // show alternatives for scenic choices

  const handleCreatePath = async () => {
    if (!routeSteps || waypoints.length < 2) {
      return toast.error("Please add at least 2 waypoints");
    }

    const sendData = {
      name: routeName,
      description,
      creator: "68abbad440fef1e01fe82b34",
      locations: routeSteps?.coordinates,
      profile: routingProfile,
      distance: routeSteps?.summary.totalDistance,
      duration: routeSteps?.summary.totalTime,
      waypoints: waypoints.map((wp, i) => ({
        label: wp.label && wp.label.trim() ? wp.label.trim() : `Waypoint ${i + 1}`,
        lat: wp.position[0],
        lng: wp.position[1],
      })),
    };
    try {
      await fetchPost("path/", optionMaker(sendData));
      toast.success("Congrats! You have created a new path!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create path, try again later");
    }
  };
  // Add a waypoint at position
  const addWaypoint = (latlng) => {
    setWaypoints((wps) => [
      ...wps,
      { id: uuidv4(), position: latlng, label: `Waypoint ${wps.length + 1}` },
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
    if (waypoints.length < 2) errs.waypoints = "At least 2 waypoints are required";
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
    // console.log(e.latlng.lat, e.latlng.lng);
  };

  // Custom map events for adding waypoint with confirmation popup
  function PendingWaypointHandler() {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-white mb-4">Create Path</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left column: form + waypoints + preview */}
        <div className="space-y-6 lg:col-span-2">
          {/* Card: Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-gray-900">
            <p className="text-sm text-gray-600 mb-4">
              Click on the map to add waypoints. Label each point, then submit to preview the
              ordered coordinates.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Route name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="e.g. Coastal Sunrise Run"
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-gray-900"
                />
                {formErrors.routeName && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.routeName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description for this path"
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-gray-900"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-medium text-gray-800">Waypoints</h2>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                    {waypoints.length}
                  </span>
                  {formErrors.waypoints && (
                    <span className="text-xs text-red-600">{formErrors.waypoints}</span>
                  )}
                </div>

                {waypoints.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">
                    Click on the map to add your first waypoint.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {waypoints.map((wp, idx) => (
                      <li
                        key={wp.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 p-2"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {idx + 1}. {wp.label?.trim() || `Waypoint ${idx + 1}`}
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            {wp.position[0].toFixed(6)}, {wp.position[1].toFixed(6)}
                          </div>
                          <label className="block text-xs text-gray-700 mb-1">Rename</label>
                          <input
                            type="text"
                            value={wp.label || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setWaypoints((wps) =>
                                wps.map((w, i) => (i === idx ? { ...w, label: val } : w))
                              );
                            }}
                            placeholder={`Waypoint ${idx + 1}`}
                            className="w-full rounded-lg border border-gray-300 px-2 py-1 text-xs outline-none focus:border-gray-900"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveWaypoint(idx, -1)}
                            disabled={idx === 0}
                            className="rounded-lg border px-2 py-1 text-xs bg-black text-white disabled:opacity-40"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveWaypoint(idx, 1)}
                            disabled={idx === waypoints.length - 1}
                            className="rounded-lg border px-2 py-1 text-xs bg-black text-white disabled:opacity-40"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeWaypoint(idx)}
                            className="rounded-lg border px-2 py-1 text-xs bg-black text-white"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-800">Routing profile</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900"
                    value={routingProfile}
                    onChange={(e) => setRoutingProfile(e.target.value)}
                  >
                    <option value="car">Driving</option>
                    <option value="bike">Cycling</option>
                    <option value="foot">Walking</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={scenicMode}
                      onChange={(e) => setScenicMode(e.target.checked)}
                    />
                    Scenic mode (show alternatives)
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
                >
                  Preview JSON
                </button>
                <button
                  onClick={handleCreatePath}
                  className="inline-flex items-center rounded-xl  bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 ml-4"
                >
                  Create Path
                </button>
              </div>
            </form>
          </div>

          {/* Card: Preview */}
          {showPreview && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-gray-900">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Submission Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="rounded-lg border px-2 py-1 text-xs bg-black text-white"
                >
                  Edit
                </button>
              </div>
              <pre className="max-h-80 overflow-auto rounded-xl bg-gray-50 p-3 text-xs text-gray-800">
                {JSON.stringify(
                  {
                    name: routeName,
                    description,
                    creator: "68abbad440fef1e01fe82b34",
                    locations: routeSteps?.coordinates,
                    profile: routingProfile,
                    distance: routeSteps?.summary.totalDistance,
                    duration: routeSteps?.summary.totalTime,
                    waypoints: waypoints.map((wp, i) => ({
                      label: wp.label && wp.label.trim() ? wp.label.trim() : `Waypoint ${i + 1}`,
                      lat: wp.position[0],
                      lng: wp.position[1],
                    })),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>

        {/* Right column: Map */}
        <div className="lg:col-span-3">
          <div className="h-[60vh] w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm text-gray-900">
            <MapContainer
              center={waypoints[0]?.position || [-33.8688, 151.2093]}
              zoom={12}
              scrollWheelZoom
              className="h-full w-full"
              whenCreated={(mapInstance) => {
                mapRef.current = mapInstance;
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Existing components */}
              <WaypointMarkers waypoints={waypoints} setWaypoints={setWaypoints} />
              <PendingWaypointHandler />
              <RouteBetweenWaypoints
                waypoints={waypoints}
                profile={routingProfile}
                scenic={scenicMode}
                handleSave={setRouteSteps}
              />

              {pendingLatLng && (
                <Marker position={pendingLatLng}>
                  <Popup closeButton={false} closeOnClick={false} autoClose={false} autoPan={false}>
                    <div className="w-56 space-y-2">
                      <div className="text-sm font-medium text-gray-900">Add waypoint here?</div>
                      <p className="text-xs text-gray-600">You can rename it below in the list.</p>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setPendingLatLng(null)}
                          className="rounded-lg border px-3 py-1 text-sm bg-black text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => addWaypoint(pendingLatLng)}
                          className="rounded-lg bg-black px-3 py-1 text-sm text-white"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Tip: click anywhere on the map to place a waypoint. Drag markers to fine‑tune positions.
          </p>
          <button
            onClick={() => {
              console.log(routeSteps);
            }}
          >
            Click
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePath;
