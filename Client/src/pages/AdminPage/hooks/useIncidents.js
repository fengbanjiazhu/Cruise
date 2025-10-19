import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { triggerPathsRefresh } from "../../../store/slices/adminSlice";
import { incidentsService } from "../services/incidentsService";

/**
 * Custom hook for managing incidents data and actions
 */
export function useIncidents() {
  const dispatch = useDispatch();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIncidents = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await incidentsService.fetchAll();
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
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const approveIncident = async (incidentId) => {
    try {
      setProcessingAction(incidentId);
      await incidentsService.approve(incidentId);
      await fetchIncidents(true);
      dispatch(triggerPathsRefresh());
      return {
        success: true,
        message: `Incident ${incidentId} approved successfully - associated path has been blocked`,
      };
    } catch (err) {
      console.error(`Error approving incident ${incidentId}:`, err);
      setError(`Failed to approve incident: ${err.message || "Unknown error"}`);
      return { success: false, error: err.message };
    } finally {
      setProcessingAction(null);
    }
  };

  const rejectIncident = async (incidentId) => {
    try {
      setProcessingAction(incidentId);
      await incidentsService.reject(incidentId);
      await fetchIncidents(true);
      return {
        success: true,
        message: `Incident ${incidentId} marked as rejected`,
      };
    } catch (err) {
      console.error(`Error rejecting incident ${incidentId}:`, err);
      setError(`Failed to reject incident: ${err.message || "Unknown error"}`);
      return { success: false, error: err.message };
    } finally {
      setProcessingAction(null);
    }
  };

  const activeIncidents = incidents.filter(
    (incident) => incident.status === "pending"
  );

  const lockedIncidents = incidents.filter(
    (incident) =>
      incident.status === "approved" || incident.status === "rejected"
  );

  return {
    incidents,
    activeIncidents,
    lockedIncidents,
    loading,
    error,
    processingAction,
    refreshing,
    approveIncident,
    rejectIncident,
    refreshIncidents: () => fetchIncidents(true),
  };
}
