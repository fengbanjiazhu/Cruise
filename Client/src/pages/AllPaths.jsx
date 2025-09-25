import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
// Service
import { fetchGet } from "../utils/api";
// UI
import { Button } from "@/components/ui/button";

import { MapContainer, TileLayer } from "react-leaflet";
import WaypointMarkers from "../components/Paths/WaypointMarkers";
import RouteBetweenWaypoints from "../components/Paths/RouteBetweenWaypoints";
//
import SavePathButton from "../components/Paths/SavePathButton";
import SearchBar from "../components/Search/SearchBar";

import NoResult from "../components/Paths/NoResult";
import Loading from "../components/ui/Loading";

const th_style = {
  padding: "0.85rem",
  fontWeight: 600,
  textAlign: "left",
  letterSpacing: "0.01em",
};

const td_style = { padding: "0.85rem", color: "#555" };

// const tr_style = { padding: "2rem", textAlign: "center", color: "#fff" };

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

function AllPaths() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPathIds, setOpenPathIds] = useState([]);
  const { user } = useSelector((state) => state.userInfo);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const saved = user?.savedList?.map((path) => path._id) || [];

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        setLoading(true);
        let url = "path";
        const queryString = searchParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
        const res = await fetchGet(url, {});
        setPaths(res.data.data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch paths");
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, [searchParams]);

  const handleTogglePath = (pathId) => {
    setOpenPathIds((ids) =>
      ids.includes(pathId) ? ids.filter((id) => id !== pathId) : [...ids, pathId]
    );
  };

  const isSaved = (pathId) => saved.includes(pathId);

  if (loading) return <Loading />;

  if (paths.length === 0)
    return (
      <NoResult>
        <Button onClick={() => setSearchParams({})}>Clear Filters</Button>
      </NoResult>
    );

  if (error)
    return (
      <NoResult title="Something Went Wrong" message={error}>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </NoResult>
    );

  return (
    <>
      <div className="flex flex-col items-center w-full min-h-screen bg-[#f7f7fa] px-4 pb-16">
        <div className="fixed top-20 right-10">
          <SearchBar />
        </div>
        <h1 className="text-[2.2rem] font-bold tracking-[-0.01em] text-[#222] mt-10 mb-6 text-center leading-[1.2]">
          User Created Paths
        </h1>
        <table className="w-full max-w-[900px] border-separate border-spacing-0 rounded-xl overflow-hidden shadow-[0_2px_12px_0_rgba(0,0,0,0.06)] bg-white mt-2 text-[#222] border border-[#ececf0]">
          <thead className="bg-[#f7f7fa] text-[#555] border-b border-[#ececf0]">
            <tr>
              <th style={th_style}>Name</th>
              <th style={th_style}>Profile</th>
              <th style={th_style}>Description</th>
              <th style={th_style}>Duration</th>
              <th style={th_style}>Creator</th>
              <th className="p-[0.85rem]"></th>
              <th className="p-[0.85rem]"></th>
            </tr>
          </thead>
          <tbody>
            {paths.map((path, idx) => (
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
                  <td className="p-[0.85rem] font-medium text-[#222]">{path.name}</td>
                  <td style={td_style}>
                    {path.profile?.charAt(0).toUpperCase() + path.profile?.slice(1)}
                  </td>
                  <td style={td_style}>{path.description || "No description."}</td>
                  <td style={td_style}>{path.duration} min</td>
                  <td style={td_style}>{path.creator?.name || "Unknown"}</td>
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
                  <td className="p-[0.85rem]">
                    <SavePathButton isSaved={isSaved(path._id)} pathId={path._id} />
                  </td>
                </tr>
                {openPathIds.includes(path._id) && (
                  <tr>
                    <td
                      colSpan={7}
                      className="bg-[#f7f7fa] p-0 rounded-b-xl border-t border-[#ececf0]"
                    >
                      {/* Only show the map for quick view */}
                      {Array.isArray(path.waypoints) && path.waypoints.length >= 2 && (
                        <div className="min-h-[220px] h-[clamp(220px,40vw,340px)] w-full rounded-xl overflow-hidden shadow-[0_2px_12px_0_rgba(0,0,0,0.06)] m-0 relative flex items-center justify-center bg-white p-2 border border-[#ececf0]">
                          <MapWithRoute waypoints={path.waypoints} profile={path.profile} />
                          <div className="absolute top-4 right-4 z-[1000] pointer-events-auto flex flex-row gap-2">
                            <Link
                              to={`/path/${path._id}`}
                              className="px-[1.2rem] py-2.5 rounded-[0.6rem] bg-[#ececf0] text-[#222] font-medium border border-[#ececf0] no-underline shadow-none text-[0.98rem] relative z-[1001] transition-colors duration-200 cursor-pointer outline-none"
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
                            </Link>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AllPaths;
