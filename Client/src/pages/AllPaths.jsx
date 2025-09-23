
import React, { useState, useEffect } from "react";
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
      <div>
        <h1>User Created Paths</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Profile</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Creator</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}>Loading paths…</td></tr>
            ) : error ? (
              <tr><td colSpan={6}>{error}</td></tr>
            ) : paths.length === 0 ? (
              <tr><td colSpan={6}>No paths found.</td></tr>
            ) : (
              paths.map((path) => (
                <tr key={path._id}>
                  <td>{path.name}</td>
                  <td>{path.profile?.charAt(0).toUpperCase() + path.profile?.slice(1)}</td>
                  <td>{path.description || "No description."}</td>
                  <td>{path.duration} min</td>
                  <td>{path.creator?.name || "Unknown"}</td>
                  <td>
                    <button onClick={() => handleOpenSlideover(path)}>
                      Open Path
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Slideover Overlay */}
        {slideoverOpen && (
          <div onClick={handleCloseSlideover} style={{position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.1)"}} />
        )}

        {/* Slideover Panel */}
        {slideoverOpen && (
          <div style={{position: "fixed", top: 0, right: 0, height: "100%", width: 420, background: "#fff", zIndex: 9999, borderRadius: "1rem 0 0 1rem", boxShadow: "-4px 0 24px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2rem 2rem 1rem 2rem", borderBottom: "1px solid #eee", borderRadius: "1rem 1rem 0 0"}}>
              <h2 style={{fontSize: "2rem", fontWeight: "bold"}}>{selectedPath?.name}</h2>
              <button onClick={handleCloseSlideover} aria-label="Close" style={{fontSize: "2rem", fontWeight: "bold", border: "none", background: "#eee", borderRadius: "50%", width: 40, height: 40, cursor: "pointer"}}>
                ×
              </button>
            </div>
            <div style={{padding: "2rem", overflowY: "auto", flex: 1}}>
              {selectedPath && (
                <>
                  <div style={{marginBottom: "1.5rem"}}>
                    <span style={{padding: "0.5rem 1rem", borderRadius: "0.5rem", fontWeight: "bold", background: "#eee"}}>
                      {selectedPath.profile.charAt(0).toUpperCase() + selectedPath.profile.slice(1)}
                    </span>
                  </div>
                  <p style={{marginBottom: "1.5rem"}}>{selectedPath.description || "No description."}</p>
                  <div style={{marginBottom: "1.5rem"}}>
                    <span style={{fontSize: "0.8rem", color: "#888"}}>Duration</span>
                    <div style={{fontWeight: "bold"}}>{selectedPath.duration} min</div>
                  </div>
                  <div style={{marginBottom: "1.5rem"}}>
                    <span style={{fontSize: "0.8rem", color: "#888"}}>Waypoints</span>
                    <div style={{fontWeight: "bold"}}>{Array.isArray(selectedPath.waypoints) ? selectedPath.waypoints.length : 0}</div>
                  </div>
                  <div style={{marginBottom: "1.5rem"}}>
                    <span style={{fontSize: "0.8rem", color: "#888"}}>Creator</span>
                    <div style={{fontWeight: "bold"}}>{selectedPath.creator?.name || "Unknown"}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  export default AllPaths;
