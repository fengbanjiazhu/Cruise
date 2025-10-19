import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IncidentDetailModal from "./IncidentDetailModal";
import IncidentsTable from "./IncidentsTable";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useIncidents } from "../hooks/useIncidents";
import { ANIMATION_VARIANTS, MOTION_PROPS } from "../constants/animations";
import { API_URL } from "../../../utils/api";

function IncidentsTab() {
  const {
    activeIncidents,
    lockedIncidents,
    loading,
    error,
    processingAction,
    refreshing,
    approveIncident,
    rejectIncident,
  } = useIncidents();

  const [testResponse, setTestResponse] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [viewingIncident, setViewingIncident] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const testConnection = async () => {
    try {
      setTestResponse("Testing connection...");
      const response = await fetch(`${API_URL}test-incident`);
      const data = await response.json();
      setTestResponse(`Test successful: ${data.message}`);
    } catch (err) {
      console.error("Test connection error:", err);
      setTestResponse(`Test failed: ${err.message}`);
    }
  };

  const handleApproveIncident = async (incidentId) => {
    const result = await approveIncident(incidentId);
    if (result.success) {
      setTestResponse(result.message);
    }
  };

  const handleRejectIncident = async (incidentId) => {
    setConfirmingDelete(null);
    const result = await rejectIncident(incidentId);
    if (result.success) {
      setTestResponse(result.message);
    }
  };

  const handleViewIncident = (incident) => {
    if (!incident) {
      console.error("No incident data available");
      return;
    }

    const incidentData = {
      id: incident.id,
      title: incident.title,
      severity: incident.severity,
      status: incident.status,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
      targetId: incident.targetId,
      targetType: incident.targetType,
      description: incident.description,
      reportedBy: incident.reportedBy,
      assignee: incident.assignee,
    };

    setViewingIncident(incidentData);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setViewingIncident(null);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={ANIMATION_VARIANTS.container}
    >
      <motion.div
        className="flex items-center justify-between mb-6"
        variants={ANIMATION_VARIANTS.item}
      >
        <h2 className="text-xl font-semibold text-gray-950">
          Incident Reports
        </h2>
        <motion.button
          onClick={testConnection}
          className="rounded-lg bg-gray-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-700 transition-all duration-300"
          {...MOTION_PROPS.button}
        >
          Test API
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {testResponse && (
          <motion.div
            className="mb-6 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg"
            {...ANIMATION_VARIANTS.fadeSlideDown}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {testResponse}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      {confirmingDelete && (
        <DeleteConfirmationModal
          incidentId={confirmingDelete}
          onConfirm={() => handleRejectIncident(confirmingDelete)}
          onCancel={() => setConfirmingDelete(null)}
        />
      )}

      {/* Tab Navigation */}
      <motion.div
        className="flex border-b gap-5 px-2 py-1 bg-gray-50 mb-6"
        variants={ANIMATION_VARIANTS.item}
      >
        <motion.button
          className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-300 ${
            activeTab === "active"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
          }`}
          onClick={() => setActiveTab("active")}
          {...MOTION_PROPS.button}
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
          {...MOTION_PROPS.button}
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
          {...ANIMATION_VARIANTS.fadeSlideDown}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {error}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === "active" && (
            <motion.div
              key="active"
              variants={ANIMATION_VARIANTS.tab}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div className="mb-6" variants={ANIMATION_VARIANTS.item}>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Active Incidents
                </h3>
                <p className="text-sm text-gray-600">
                  Pending incidents that require your attention. You can approve
                  or reject these incidents.
                </p>
              </motion.div>
              <IncidentsTable
                incidents={activeIncidents}
                showActions={true}
                refreshing={refreshing}
                processingAction={processingAction}
                onView={handleViewIncident}
                onApprove={handleApproveIncident}
                onReject={setConfirmingDelete}
              />
            </motion.div>
          )}

          {activeTab === "locked" && (
            <motion.div
              key="locked"
              variants={ANIMATION_VARIANTS.tab}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.div className="mb-6" variants={ANIMATION_VARIANTS.item}>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Locked Incidents
                </h3>
                <p className="text-sm text-gray-600">
                  Historical record of approved and rejected incidents. These
                  are read-only for audit purposes.
                </p>
              </motion.div>
              <IncidentsTable
                incidents={lockedIncidents}
                showActions={false}
                refreshing={refreshing}
                processingAction={processingAction}
                onView={handleViewIncident}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Incident Detail Modal */}
      <AnimatePresence>
        {showDetailModal && viewingIncident && (
          <IncidentDetailModal
            incident={viewingIncident}
            isOpen={showDetailModal}
            onClose={handleCloseDetailModal}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default IncidentsTab;
