import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { triggerPathsRefresh } from "../../../store/slices/adminSlice";
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
  const dispatch = useDispatch();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testResponse, setTestResponse] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    fetchIncidents();
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
        body: JSON.stringify({ status: "approved" }),
      });

      fetchIncidents();
      dispatch(triggerPathsRefresh());
      setTestResponse(`Incident ${incidentId} approved successfully - associated path has been blocked`);
    } catch (err) {
      console.error(`Error approving incident ${incidentId}:`, err);
      setError(`Failed to approve incident: ${err.message || "Unknown error"}`);
    } finally {
      setProcessingAction(null);
    }
  };

  const initiateRejectIncident = (incidentId) => {
    setConfirmingDelete(incidentId);
  };

  const handleRejectIncident = async (incidentId) => {
    try {
      setProcessingAction(incidentId);
      setConfirmingDelete(null);

      const endpoint = API_ROUTES.incident.delete(incidentId);
      console.log(`Rejecting incident ${incidentId} at endpoint ${endpoint}`);

      await fetchDelete(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      fetchIncidents();
      setTestResponse(`Incident ${incidentId} marked as rejected`);
    } catch (err) {
      console.error(`Error rejecting incident ${incidentId}:`, err);
      setError(`Failed to reject incident: ${err.message || "Unknown error"}`);
    } finally {
      setProcessingAction(null);
    }
  };

  const cancelDelete = () => {
    setConfirmingDelete(null);
  };

  // Filter incidents based on status
  const activeIncidents = incidents.filter(incident => incident.status === "pending");
  const lockedIncidents = incidents.filter(incident => 
    incident.status === "approved" || incident.status === "rejected"
  );

  const renderIncidentsTable = (incidentsList, showActions = true) => (
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
            {showActions && (
              <th className="px-4 py-3 text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {incidentsList.length > 0 ? (
            incidentsList.map((i) => (
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
                {showActions && (
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => console.log("View incident", i.id)}
                        className="rounded-lg bg-white border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleApproveIncident(i.id)}
                        disabled={processingAction === i.id}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
                      >
                        {processingAction === i.id ? "Processing..." : "Approve"}
                      </button>
                      <button
                        onClick={() => initiateRejectIncident(i.id)}
                        disabled={processingAction === i.id}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
                      >
                        {processingAction === i.id ? "Processing..." : "Reject"}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={showActions ? "8" : "7"}
                className="px-4 py-6 text-center text-gray-500"
              >
                No incidents found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-950">
          Incident Reports
        </h2>
        <div className="flex gap-2">
          <button
            onClick={testConnection}
            className="rounded-lg bg-gray-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-700 transition-colors duration-200"
          >
            Test API
          </button>
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
              Confirm Rejection
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to reject incident {confirmingDelete}? This will mark it as rejected but keep the record.
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
                Reject Incident
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b gap-5 px-2 py-1 bg-gray-50 mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
            activeTab === "active"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active ({activeIncidents.length})
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
            activeTab === "locked"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
          }`}
          onClick={() => setActiveTab("locked")}
        >
          Locked ({lockedIncidents.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <div>
          {activeTab === "active" && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Active Incidents
                </h3>
                <p className="text-sm text-gray-600">
                  Pending incidents that require your attention. You can approve or reject these incidents.
                </p>
              </div>
              {renderIncidentsTable(activeIncidents, true)}
            </div>
          )}
          
          {activeTab === "locked" && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Locked Incidents
                </h3>
                <p className="text-sm text-gray-600">
                  Historical record of approved and rejected incidents. These are read-only for audit purposes.
                </p>
              </div>
              {renderIncidentsTable(lockedIncidents, false)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IncidentsTab;
