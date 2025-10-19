import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pill from "./Pill";
import {
  formatDate,
  incidentSeverityClass,
  incidentStatusClass,
} from "../utils/formatters";
import { ANIMATION_VARIANTS, MOTION_PROPS } from "../constants/animations";

function IncidentsTable({
  incidents,
  showActions = true,
  refreshing = false,
  processingAction = null,
  onView,
  onApprove,
  onReject,
}) {
  return (
    <motion.div
      className="w-full overflow-x-auto rounded-lg border"
      initial="initial"
      variants={ANIMATION_VARIANTS.refresh}
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
            {incidents.length > 0 ? (
              incidents.map((incident, index) => (
                <motion.tr
                  key={incident.id}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: -10 }}
                  variants={ANIMATION_VARIANTS.tableRow}
                  transition={{ delay: index * 0.03 }}
                  {...MOTION_PROPS.tableRowHover}
                  className="hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {incident.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {incident.title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Pill className={incidentSeverityClass(incident.severity)}>
                      {incident.severity}
                    </Pill>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Pill className={incidentStatusClass(incident.status)}>
                      {incident.status}
                    </Pill>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {incident.assignee}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {formatDate(incident.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {formatDate(incident.updatedAt)}
                  </td>
                  {showActions && (
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <motion.button
                          onClick={() => onView(incident)}
                          className="rounded-lg bg-white border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-all duration-300"
                          {...MOTION_PROPS.button}
                        >
                          View
                        </motion.button>
                        <motion.button
                          onClick={() => onApprove(incident.id)}
                          disabled={processingAction === incident.id}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
                          {...MOTION_PROPS.button}
                        >
                          {processingAction === incident.id
                            ? "Processing..."
                            : "Approve"}
                        </motion.button>
                        <motion.button
                          onClick={() => onReject(incident.id)}
                          disabled={processingAction === incident.id}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-300 disabled:opacity-50"
                          {...MOTION_PROPS.button}
                        >
                          {processingAction === incident.id
                            ? "Processing..."
                            : "Reject"}
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
}

export default IncidentsTable;
