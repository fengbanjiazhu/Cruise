import React, { useState, useEffect } from "react";
import { API_ROUTES, fetchGet } from "../../../utils/api";
import ReportPathModal from "./ReportPathModal";

function PathsTab() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);

  useEffect(() => {
    fetchPaths();
  }, []);

  const fetchPaths = async () => {
    try {
      setLoading(true);
      console.log("Fetching paths from:", API_ROUTES.path.getAll);
      const response = await fetchGet(API_ROUTES.path.getAll);
      console.log("Paths response:", response);

      // Handle different response formats
      let pathsData = [];
      if (response && Array.isArray(response)) {
        pathsData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        pathsData = response.data;
      } else if (response && response.status === "success" && response.data) {
        // Handle nested data structure
        if (Array.isArray(response.data)) {
          pathsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          pathsData = response.data.data;
        }
      } else {
        console.warn("Unexpected paths response format:", response);
        pathsData = [];
      }

      console.log("Processed paths data:", pathsData);
      setPaths(pathsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching paths:", err);
      setError(`Failed to load paths: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReportClick = (path) => {
    setSelectedPath(path);
    setShowReportModal(true);
  };

  const handleCloseModal = () => {
    setShowReportModal(false);
    setSelectedPath(null);
  };

  const handleReportSubmit = () => {
    handleCloseModal();
    // Show a success message if needed
    // Optionally refresh paths after submission
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p>Loading paths...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 py-8 bg-red-50 p-4 rounded-md border border-red-200">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
        <button
          onClick={fetchPaths}
          className="mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!paths || paths.length === 0) {
    return (
      <div className="py-8 text-center bg-gray-50 p-6 rounded-md">
        <p className="text-gray-500">No paths found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Creator
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Distance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paths.map((path) => (
            <tr key={path._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {path.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {path.creator?.name || "Unknown"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {path.distance ? `${path.distance} km` : "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {path.ratingsAverage
                    ? `${path.ratingsAverage} (${path.ratingsQuantity || 0})`
                    : "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleReportClick(path)}
                  className="text-white bg-red-500 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
                >
                  Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showReportModal && selectedPath && (
        <ReportPathModal
          path={selectedPath}
          isOpen={showReportModal}
          onClose={handleCloseModal}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
}

export default PathsTab;
