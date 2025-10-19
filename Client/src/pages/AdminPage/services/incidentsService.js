import {
  API_ROUTES,
  fetchGet,
  fetchPost,
  fetchDelete,
} from "../../../utils/api";

/**
 * Service for handling incident-related API calls
 */
export const incidentsService = {
  /**
   * Fetch all incidents
   */
  async fetchAll() {
    return await fetchGet(API_ROUTES.incident.getAll, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  /**
   * Approve an incident (sets status to 'approved')
   */
  async approve(incidentId) {
    const endpoint = API_ROUTES.incident.update(incidentId);
    return await fetchPost(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "approved" }),
    });
  },

  /**
   * Reject an incident (deletes it)
   */
  async reject(incidentId) {
    const endpoint = API_ROUTES.incident.delete(incidentId);
    return await fetchDelete(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
