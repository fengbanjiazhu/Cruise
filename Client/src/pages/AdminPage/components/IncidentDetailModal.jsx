import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchGet, API_ROUTES } from "../../../utils/api";
import Pill from "./Pill";
import {
  formatDate,
  incidentSeverityClass,
  incidentStatusClass,
} from "../utils/formatters";

function IncidentDetailModal({ incident, isOpen, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pathDetails, setPathDetails] = useState(null);

  useEffect(() => {
    console.log("Incident data received:", incident);

    if (incident && incident.targetId) {
      fetchPathDetails(incident.targetId);
    } else {
      console.log("No targetId found in incident:", incident);
      setLoading(false);
    }
  }, [incident]);

  const fetchPathDetails = async (pathId) => {
    try {
      console.log("Fetching path details for ID:", pathId);
      setLoading(true);

      const endpoint = `${API_ROUTES.path.getById(pathId)}?populate=creator`;
      console.log("Using endpoint with populate:", endpoint);

      const response = await fetchGet(endpoint);
      console.log("Path details received:", response);

      let pathData;
      if (response && response.data && response.data.data) {
        pathData = response.data.data;
        setPathDetails(pathData);
      } else if (response && response.data) {
        pathData = response.data;
        setPathDetails(pathData);
      } else {
        pathData = response;
        setPathDetails(pathData);
      }

      console.log("Path creator information:", {
        creatorExists: !!pathData?.creator,
        creatorType: pathData?.creator ? typeof pathData.creator : "undefined",
        creatorValue: pathData?.creator,
        creatorDetails:
          typeof pathData?.creator === "object"
            ? { name: pathData.creator.name, email: pathData.creator.email }
            : "Not an object",
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching path details:", err);
      setError("Failed to load path details. The path may have been deleted.");
    } finally {
      setLoading(false);
    }
  };

  const getCreatorName = (path) => {
    if (!path) return "Unknown User";

    try {
      console.log("Getting creator name from path:", path);

      if (path.creator) {
        if (typeof path.creator === "object" && path.creator !== null) {
          if (path.creator.name) return path.creator.name;
          if (path.creator.email) return path.creator.email;
          if (path.creator.username) return path.creator.username;

          if (path.creator._doc) {
            if (path.creator._doc.name) return path.creator._doc.name;
            if (path.creator._doc.email) return path.creator._doc.email;
          }
        }

        if (typeof path.creator === "string") {
          if (!/^[0-9a-f]{24}$/i.test(path.creator)) {
            return path.creator;
          }
        }
      }

      if (path.user) {
        if (typeof path.user === "object" && path.user !== null) {
          if (path.user.name) return path.user.name;
          if (path.user.email) return path.user.email;
        }
      }

      return "Unknown User";
    } catch (err) {
      console.error("Error extracting creator name:", err);
      return "Unknown User";
    }
  };

  if (!isOpen) return null;

  if (!incident) {
    return (
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Error</h2>
          <p className="text-red-600">No incident data available</p>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const th_style = {
    padding: "0.85rem",
    fontWeight: 600,
    textAlign: "left",
    letterSpacing: "0.01em",
    backgroundColor: "#f7f7fa",
    color: "#555",
  };

  const td_style = {
    padding: "0.85rem",
    color: "#555",
    backgroundColor: "#fff",
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 300,
          duration: 0.4,
        }}
      >
        {/* Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            Incident Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Incident Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Incident Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">ID</span>
                  <p className="font-medium">{incident?.id || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Title</span>
                  <p className="font-medium">{incident?.title || "N/A"}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <div className="mt-1">
                    {incident?.status ? (
                      <Pill className={incidentStatusClass(incident.status)}>
                        {incident.status}
                      </Pill>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Severity</span>
                  <div className="mt-1">
                    {incident?.severity ? (
                      <Pill
                        className={incidentSeverityClass(incident.severity)}
                      >
                        {incident.severity}
                      </Pill>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Created</span>
                  <p className="font-medium">
                    {incident?.createdAt
                      ? formatDate(incident.createdAt)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Updated</span>
                  <p className="font-medium">
                    {incident?.updatedAt
                      ? formatDate(incident.updatedAt)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Path Information */}
          {incident.targetId && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Related Path
              </h3>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              ) : pathDetails ? (
                <div className="space-y-6">
                  {/* Path Table - Similar to AllPaths */}
                  <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full border-collapse bg-white text-left text-sm text-gray-800">
                      <thead>
                        <tr>
                          <th style={th_style}>Name</th>
                          <th style={th_style}>Profile</th>
                          <th style={th_style}>Description</th>
                          <th style={th_style}>Duration</th>
                          <th style={th_style}>Creator</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={td_style}
                            className="font-medium text-gray-900"
                          >
                            {pathDetails.name || "Unnamed Path"}
                          </td>
                          <td style={td_style}>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                pathDetails.profile === "car"
                                  ? "bg-purple-100 text-purple-800"
                                  : pathDetails.profile === "bike"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {pathDetails.profile
                                ? pathDetails.profile.charAt(0).toUpperCase() +
                                  pathDetails.profile.slice(1)
                                : "Unknown"}
                            </span>
                          </td>
                          <td style={td_style}>
                            {pathDetails.description ||
                              "No description provided"}
                          </td>
                          <td style={td_style}>
                            {pathDetails.duration
                              ? `${pathDetails.duration} min`
                              : "N/A"}
                          </td>
                          <td style={td_style}>
                            {(() => {
                              // Detailed debug logging for creator name
                              console.log("Rendering creator name with:", {
                                creator: pathDetails.creator,
                                creatorType: typeof pathDetails.creator,
                                isObject:
                                  typeof pathDetails.creator === "object",
                                name: pathDetails.creator?.name,
                                calculatedValue: getCreatorName(pathDetails),
                              });
                              return getCreatorName(pathDetails);
                            })()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 py-4">
                  No path information available
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default IncidentDetailModal;
