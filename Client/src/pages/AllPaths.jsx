
import React, { useState, useEffect } from "react";
import Card from "../components/UI/Card";
import { fetchGet } from "../utils/api";

  function AllPaths() {
    const [paths, setPaths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [slideoverOpen, setSlideoverOpen] = useState(false);
    const [selectedPath, setSelectedPath] = useState(null);

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

    const handleOpenSlideover = (path) => {
      setSelectedPath(path);
      setSlideoverOpen(true);
    };
    const handleCloseSlideover = () => {
      setSlideoverOpen(false);
      setSelectedPath(null);
    };

    return (
      <div className="max-w-4xl mx-auto py-10 px-4 relative">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-white tracking-tight rounded-xl py-6 shadow">User Created Paths</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="col-span-2 text-center py-10 text-gray-400 text-lg">Loading paths…</div>
          ) : error ? (
            <div className="col-span-2 text-center py-10 text-red-500 text-lg">{error}</div>
          ) : paths.length === 0 ? (
            <div className="col-span-2 text-center py-10 text-gray-400 text-lg">No paths found.</div>
          ) : (
            paths.map((path) => (
              <Card
                key={path._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-7 flex flex-col justify-between min-h-[260px] hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{path.name}</h2>
                  <span className={`rounded-lg px-4 py-1 text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200`}>
                    {path.profile?.charAt(0).toUpperCase() + path.profile?.slice(1)}
                  </span>
                </div>
                <p className="text-gray-700 text-base mb-4 font-medium">{path.description || "No description."}</p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Duration</span>
                    <span className="font-bold text-base text-gray-900">{path.duration} min</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Waypoints</span>
                    <span className="font-bold text-base text-gray-900">{Array.isArray(path.waypoints) ? path.waypoints.length : 0}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">Creator</span>
                    <span className="font-semibold text-gray-800">{path.creator?.name || "Unknown"}</span>
                  </div>
                </div>
                <button
                  className="mt-6 px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-semibold border border-gray-300 hover:bg-gray-200 transition-all"
                  onClick={() => handleOpenSlideover(path)}
                >
                  <span className="inline-block align-middle mr-2">🔍</span> View Details
                </button>
              </Card>
            ))
          )}
        </div>

        {/* Slideover Overlay */}
        {slideoverOpen && (
          <div
            className="fixed inset-0 z-[9998] bg-black/10 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseSlideover}
          />
        )}

        {/* Slideover Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-[420px] bg-white z-[9999] rounded-l-2xl shadow-[0_2px_32px_rgba(0,0,0,0.13)] transform transition-transform duration-300 ease-in-out flex flex-col ${
            slideoverOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ boxShadow: "-4px 0 24px rgba(0,0,0,0.12)" }}
        >
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-900">{selectedPath?.name}</h2>
            <button
              className="text-gray-400 hover:text-gray-700 text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all"
              onClick={handleCloseSlideover}
              aria-label="Close"
              style={{ lineHeight: 0 }}
            >
              <span className="text-3xl">×</span>
            </button>
          </div>
          <div className="px-8 py-6 flex-1 overflow-y-auto">
            {selectedPath && (
              <>
                <div className="mb-6">
                  <span className="rounded-lg px-4 py-1 text-sm font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                    {selectedPath.profile.charAt(0).toUpperCase() + selectedPath.profile.slice(1)}
                  </span>
                </div>
                <p className="text-gray-700 text-base mb-6 font-medium">{selectedPath.description || "No description."}</p>
                <div className="mb-6">
                  <span className="text-xs text-gray-500">Duration</span>
                  <div className="font-bold text-base text-gray-900">{selectedPath.duration} min</div>
                </div>
                <div className="mb-6">
                  <span className="text-xs text-gray-500">Waypoints</span>
                  <div className="font-bold text-base text-gray-900">{Array.isArray(selectedPath.waypoints) ? selectedPath.waypoints.length : 0}</div>
                </div>
                <div className="mb-6">
                  <span className="text-xs text-gray-500">Creator</span>
                  <div className="font-semibold text-gray-800">{selectedPath.creator?.name || "Unknown"}</div>
                </div>
                {/* Add more details here if needed */}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  export default AllPaths;
