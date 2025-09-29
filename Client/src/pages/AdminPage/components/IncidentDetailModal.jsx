import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchGet } from "../../../utils/api";
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
    if (incident && incident.targetType === "Path" && incident.targetId) {
      fetchPathDetails(incident.targetId);
    } else {
      setLoading(false);
    }
  }, [incident]);

  const fetchPathDetails = async (pathId) => {
    try {
      setLoading(true);
      const response = await fetchGet(`path/${pathId}`);
      setPathDetails(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching path details:", err);
      setError("Failed to load path details. The path may have been deleted.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
                  <p className="font-medium">{incident?.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Title</span>
                  <p className="font-medium">{incident?.title}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <div className="mt-1">
                    {incident?.status && (
                      <Pill className={incidentStatusClass(incident.status)}>
                        {incident.status}
                      </Pill>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Severity</span>
                  <div className="mt-1">
                    {incident?.severity && (
                      <Pill
                        className={incidentSeverityClass(incident.severity)}
                      >
                        {incident.severity}
                      </Pill>
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
          {incident?.targetType === "Path" && (
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Path Name</span>
                        <p className="font-medium">{pathDetails.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Description
                        </span>
                        <p className="font-medium">
                          {pathDetails.description || "No description"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Profile</span>
                        <p className="font-medium capitalize">
                          {pathDetails.profile}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Distance</span>
                        <p className="font-medium">
                          {pathDetails.distance
                            ? `${(pathDetails.distance / 1000).toFixed(2)} km`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Duration</span>
                        <p className="font-medium">
                          {pathDetails.duration
                            ? `${pathDetails.duration} min`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Rating</span>
                        <p className="font-medium">
                          {pathDetails.ratingsAverage
                            ? `${pathDetails.ratingsAverage} (${
                                pathDetails.ratingsQuantity || 0
                              } reviews)`
                            : "No ratings"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Map Preview Placeholder */}
                  {pathDetails.waypoints &&
                    pathDetails.waypoints.length >= 2 && (
                      <div>
                        <span className="text-sm text-gray-500 block mb-2">
                          Path Preview
                        </span>
                        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                          <p className="text-gray-500">
                            Map preview would be displayed here
                          </p>
                        </div>
                      </div>
                    )}
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
