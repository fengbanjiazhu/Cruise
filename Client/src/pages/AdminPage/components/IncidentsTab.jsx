import React, { useState, useEffect } from "react";
import Pill from "./Pill";
import {
  formatDate,
  incidentSeverityClass,
  incidentStatusClass,
} from "../utils/formatters";
import {
  API_ROUTES,
  fetchGet,
  fetchPost,
  fetchDelete,
  API_URL,
} from "../../../utils/api";

function IncidentsTab() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [testResponse, setTestResponse] = useState(null);
  const [newIncident, setNewIncident] = useState({
    title: "",
    severity: "medium",
    assignee: "Unassigned",
  });
  const [processingAction, setProcessingAction] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);

  useEffect(() => {
    fetchIncidents();
    // For debugging - log API URL and route
    console.log("API URL:", API_URL);
    console.log("Incidents endpoint:", API_URL + API_ROUTES.incident.getAll);
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      console.log("Fetching from:", API_ROUTES.incident.getAll);
      const data = await fetchGet(API_ROUTES.incident.getAll, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Incidents data received:", data);
      console.log("Number of incidents:", data.length);
      console.log("First incident sample:", data[0]);
      setIncidents(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching incidents:", err);
      setError(`Failed to load incidents: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setTestResponse("Testing connection...");
      const response = await fetch(`${API_URL}test-incident`);
      const data = await response.json();
      console.log("Test response:", data);
      setTestResponse(`Test successful: ${data.message}`);
    } catch (err) {
      console.error("Test connection error:", err);
      setTestResponse(`Test failed: ${err.message}`);
    }
  };

  const handleApproveIncident = async (incidentId) => {
    try {
      setProcessingAction(incidentId);
      const endpoint = API_ROUTES.incident.update(incidentId);
      console.log(`Approving incident ${incidentId} at endpoint ${endpoint}`);

      await fetchPost(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "resolved" }),
      });

      // Refresh incidents after update
      fetchIncidents();

      // Show success message
      setTestResponse(`Incident ${incidentId} approved successfully`);
    } catch (err) {
      console.error(`Error approving incident ${incidentId}:`, err);
      setError(`Failed to approve incident: ${err.message || "Unknown error"}`);
    } finally {
      setProcessingAction(null);
    }
  };

  const initiateRejectIncident = (incidentId) => {
    // Set the incident ID in state to show confirmation dialog
    setConfirmingDelete(incidentId);
  };

  const handleRejectIncident = async (incidentId) => {
    try {
      setProcessingAction(incidentId);
      setConfirmingDelete(null); // Clear confirmation dialog

      const endpoint = API_ROUTES.incident.delete(incidentId);
      console.log(`Deleting incident ${incidentId} at endpoint ${endpoint}`);

      await fetchDelete(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Refresh incidents after deletion
      fetchIncidents();

      // Show success message
      setTestResponse(`Incident ${incidentId} deleted successfully`);
    } catch (err) {
      console.error(`Error deleting incident ${incidentId}:`, err);
      setError(`Failed to delete incident: ${err.message || "Unknown error"}`);
    } finally {
      setProcessingAction(null);
    }
  };

  const cancelDelete = () => {
    setConfirmingDelete(null);
  };

  const handleCreateIncident = () => {
    setIsCreating(true);
    // Generate a new incident ID using the pattern INC-XXXX
    const lastIncidentId =
      incidents.length > 0
        ? incidents.sort((a, b) => a.id.localeCompare(b.id))[
            incidents.length - 1
          ].id
        : "INC-2400";

    const idNumber = parseInt(lastIncidentId.split("-")[1]) + 1;
    const newId = `INC-${idNumber}`;

    setNewIncident((prev) => ({
      ...prev,
      id: newId,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIncident((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitIncident = async (e) => {
    e.preventDefault();
    try {
      await fetchPost(API_ROUTES.incident.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIncident),
      });

      // Refresh incidents after creating
      fetchIncidents();
      setIsCreating(false);
      setNewIncident({
        title: "",
        severity: "medium",
        assignee: "Unassigned",
      });
    } catch (err) {
      console.error("Error creating incident:", err);
      setError("Failed to create incident. Please try again.");
    }
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewIncident({
      title: "",
      severity: "medium",
      assignee: "Unassigned",
    });
  };

  // Removed unused showActionButtons function

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-950">
          Incident Reports
        </h2>
        <div className="flex gap-2">
          {!isCreating && (
            <>
              <button
                onClick={testConnection}
                className="rounded-lg bg-gray-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-700 transition-colors duration-200"
              >
                Test API
              </button>
              <button
                onClick={handleCreateIncident}
                className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors duration-200"
              >
                + New Incident
              </button>
            </>
          )}
        </div>
      </div>

      {testResponse && (
        <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
          {testResponse}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmingDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium mb-4 text-gray-900">
              Confirm Deletion
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete incident {confirmingDelete}? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectIncident(confirmingDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Incident
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreating && (
        <div className="bg-white p-4 mb-6 border rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-3">Create New Incident</h3>
          <form onSubmit={handleSubmitIncident}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <input
                  type="text"
                  value={newIncident.id || ""}
                  disabled
                  className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newIncident.title}
                  onChange={handleInputChange}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  name="severity"
                  value={newIncident.severity}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignee
                </label>
                <input
                  type="text"
                  name="assignee"
                  value={newIncident.assignee}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelCreate}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Incident
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Severity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Assignee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Updated
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {incidents.length > 0 ? (
                incidents.map((i) => (
                  <tr key={i.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {i.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {i.title}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Pill className={incidentSeverityClass(i.severity)}>
                        {i.severity}
                      </Pill>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Pill className={incidentStatusClass(i.status)}>
                        {i.status}
                      </Pill>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {i.assignee}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {formatDate(i.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                      {formatDate(i.updatedAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* View button */}
                        <button
                          onClick={() => console.log("View incident", i.id)}
                          className="rounded-lg bg-white border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                        >
                          View
                        </button>

                        {/* Approve button - always visible */}
                        <button
                          onClick={() => handleApproveIncident(i.id)}
                          disabled={processingAction === i.id}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
                        >
                          {processingAction === i.id
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        {/* Delete button - always visible */}
                        <button
                          onClick={() => initiateRejectIncident(i.id)}
                          disabled={processingAction === i.id}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
                        >
                          {processingAction === i.id
                            ? "Processing..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No incidents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default IncidentsTab;
