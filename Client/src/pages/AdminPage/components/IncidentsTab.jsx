// John
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { triggerPathsRefresh } from "../../../store/slices/adminSlice";
import Pill from "./Pill";
import IncidentDetailModal from "./IncidentDetailModal";
import { formatDate, incidentSeverityClass, incidentStatusClass } from "../utils/formatters";
import { API_ROUTES, fetchGet, fetchPost, fetchDelete, API_URL } from "../../../utils/api";

function IncidentsTab() {
  const dispatch = useDispatch();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testResponse, setTestResponse] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [refreshing, setRefreshing] = useState(false);
  const [viewingIncident, setViewingIncident] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Smooth animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: 10,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const refreshVariants = {
    initial: { opacity: 1 },
    refreshing: {
      opacity: 0.7,
      transition: { duration: 0.3 },
    },
    refreshed: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  useEffect(() => {
    fetchIncidents();
    console.log("API URL:", API_URL);
    console.log("Incidents endpoint:", API_URL + API_ROUTES.incident.getAll);
  }, []);

  const fetchIncidents = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
      if (isRefresh) {
        setRefreshing(false);
      }
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

      // Refresh with animation
      await fetchIncidents(true);
      dispatch(triggerPathsRefresh());
      setTestResponse(
        `Incident ${incidentId} approved successfully - associated path has been blocked`
      );
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

      // Refresh with animation
      await fetchIncidents(true);
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

  const handleViewIncident = (incident) => {
    console.log("View incident clicked:", incident);
    if (!incident) {
      console.error("No incident data available");
      return;
    }

    // Create a clean copy of the incident data with all required fields
    const incidentData = {
      id: incident.id,
      title: incident.title,
      severity: incident.severity,
      status: incident.status,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
      targetId: incident.targetId,
      targetType: incident.targetType,
      // Include any additional fields that might be needed
      description: incident.description,
      reportedBy: incident.reportedBy,
      assignee: incident.assignee,
    };

    console.log("Prepared incident data for modal:", incidentData);
    setViewingIncident(incidentData);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setViewingIncident(null);
  };

  // Filter incidents based on status
  const activeIncidents = incidents.filter((incident) => incident.status === "pending");
  const lockedIncidents = incidents.filter(
    (incident) => incident.status === "approved" || incident.status === "rejected"
  );

  const renderIncidentsTable = (incidentsList, showActions = true) => (
    <motion.div
      className="w-full overflow-x-auto rounded-lg border"
      initial="initial"
      variants={refreshVariants}
      animate={refreshing ? "refreshing" : "refreshed"}
    >
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Title
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Severity
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Assignee
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Created
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Updated
            </th>
            {showActions && <th className="px-6 py-4 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          <AnimatePresence>
            {incidentsList.length > 0 ? (
              incidentsList.map((i, index) => (
                <motion.tr
                  key={i.id}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                  variants={tableRowVariants}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{
                    backgroundColor: "#f9fafb",
                    transition: { duration: 0.2, ease: "easeOut" },
                  }}
                  className="hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {i.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{i.title}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Pill className={incidentSeverityClass(i.severity)}>{i.severity}</Pill>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Pill className={incidentStatusClass(i.status)}>{i.status}</Pill>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {i.assignee}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {formatDate(i.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {formatDate(i.updatedAt)}
                  </td>
                  {showActions && (
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <motion.button
                          onClick={() => handleViewIncident(i)}
                          className="rounded-lg bg-white border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          View
                        </motion.button>
                        <motion.button
                          onClick={() => handleApproveIncident(i.id)}
                          disabled={processingAction === i.id}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          {processingAction === i.id ? "Processing..." : "Approve"}
                        </motion.button>
                        <motion.button
                          onClick={() => initiateRejectIncident(i.id)}
                          disabled={processingAction === i.id}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          {processingAction === i.id ? "Processing..." : "Reject"}
                        </motion.button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            ) : (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <td
                  colSpan={showActions ? "8" : "7"}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No incidents found
                </td>
              </motion.tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="flex items-center justify-between mb-6" variants={itemVariants}>
        <h2 className="text-xl font-semibold text-gray-950">Incident Reports</h2>
        <motion.button
          onClick={testConnection}
          className="rounded-lg bg-gray-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-700 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          Test API
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {testResponse && (
          <motion.div
            className="mb-6 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {testResponse}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {confirmingDelete && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md mx-auto"
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
              <h3 className="text-lg font-medium mb-4 text-gray-900">Confirm Rejection</h3>
              <p className="mb-6 text-gray-700">
                Are you sure you want to reject incident {confirmingDelete}? This will mark it as
                rejected but keep the record.
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 shadow-sm transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => handleRejectIncident(confirmingDelete)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  Reject Incident
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <motion.div className="flex border-b gap-5 px-2 py-1 bg-gray-50 mb-6" variants={itemVariants}>
        <motion.button
          className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-300 ${
            activeTab === "active"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
          }`}
          onClick={() => setActiveTab("active")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          Active ({activeIncidents.length})
        </motion.button>
        <motion.button
          className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-300 ${
            activeTab === "locked"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
          }`}
          onClick={() => setActiveTab("locked")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          Locked ({lockedIncidents.length})
        </motion.button>
      </motion.div>

      {loading ? (
        <motion.div
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      ) : error ? (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {error}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === "active" && (
            <motion.div
              key="active"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div className="mb-6" variants={itemVariants}>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Active Incidents</h3>
                <p className="text-sm text-gray-600">
                  Pending incidents that require your attention. You can approve or reject these
                  incidents.
                </p>
              </motion.div>
              {renderIncidentsTable(activeIncidents, true)}
            </motion.div>
          )}

          {activeTab === "locked" && (
            <motion.div
              key="locked"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div className="mb-6" variants={itemVariants}>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Locked Incidents</h3>
                <p className="text-sm text-gray-600">
                  Historical record of approved and rejected incidents. These are read-only for
                  audit purposes.
                </p>
              </motion.div>
              {renderIncidentsTable(lockedIncidents, false)}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Add the IncidentDetailModal */}
      <AnimatePresence>
        {showDetailModal && viewingIncident && (
          <>
            {console.log("Rendering modal with incident:", viewingIncident)}
            <IncidentDetailModal
              incident={viewingIncident}
              isOpen={showDetailModal}
              onClose={handleCloseDetailModal}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default IncidentsTab;
