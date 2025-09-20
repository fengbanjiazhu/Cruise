import React, { useState, useEffect } from "react";
import { API_ROUTES, fetchPost } from "../../../utils/api";
import { useSelector } from "react-redux";

function ReportPathModal({ path, isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const userInfo = useSelector((state) => state.userInfo);
  const [incidentId, setIncidentId] = useState("");

  // Generate an incident ID on component mount
  useEffect(() => {
    const generateIncidentId = () => {
      const prefix = "INC";
      const timestamp = new Date().getTime().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `${prefix}-${timestamp}${random}`;
    };

    setIncidentId(generateIncidentId());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please provide a title for the report");
      return;
    }

    if (!path || !path._id) {
      setError("Cannot identify path information");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const incidentData = {
        id: incidentId,
        title: title,
        severity: severity,
        targetId: path._id,
        targetType: "Path",
        user: userInfo?.user?._id, // Safely access user ID
        status: "pending",
      };

      // Log the incident data we're sending
      console.log("Submitting incident data:", incidentData);

      await fetchPost(API_ROUTES.incident.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : "",
        },
        body: JSON.stringify(incidentData),
      });

      onSubmit();
    } catch (err) {
      console.error("Error submitting report:", err);
      setError(`Failed to submit report: ${err.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Report Path</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Path:</span> {path.name}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Creator:</span>{" "}
            {path.creator?.name || "Unknown"}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Incident ID: {incidentId}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Report Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a brief description of the issue"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="severity"
              className="block text-gray-700 font-medium mb-2"
            >
              Severity
            </label>
            <select
              id="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportPathModal;
