import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGet } from "../utils/api";

function PathDetail() {
  const { pathID } = useParams();
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPath() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchGet(`path/${pathID}`, {});
        setPath(res.data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch path");
      } finally {
        setLoading(false);
      }
    }
    fetchPath();
  }, [pathID]);

  if (loading) return <div>Loading path…</div>;
  if (error) return <div>{error}</div>;
  if (!path) return <div>No path found.</div>;

  return (
    <div>
      <h1>{path.name}</h1>
      <p><strong>Profile:</strong> {path.profile}</p>
      <p><strong>Description:</strong> {path.description}</p>
      <p><strong>Duration:</strong> {path.duration} min</p>
      <p><strong>Creator:</strong> {path.creator?.name || "Unknown"}</p>
      <p><strong>Waypoints:</strong> {Array.isArray(path.waypoints) ? path.waypoints.length : 0}</p>
      {/* Add more fields as needed */}
    </div>
  );
}

export default PathDetail;
