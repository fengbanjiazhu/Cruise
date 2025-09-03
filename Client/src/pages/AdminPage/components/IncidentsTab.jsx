import React from "react";
import Pill from "./Pill";
import { mockIncidents } from "../utils/mockData";
import {
  formatDate,
  incidentSeverityClass,
  incidentStatusClass,
} from "../utils/formatters";

function IncidentsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-950">
          Incident Reports
        </h2>
        <button className="rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
          + New Incident
        </button>
      </div>

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
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {mockIncidents.map((i) => (
              <tr key={i.id}>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                  {i.id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">{i.title}</td>
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
                  <button className="rounded-md border px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Mock incidents — replace with Firestore collection (e.g.
        <code className="mx-1">incidents</code>) when integrating.
      </p>
    </div>
  );
}

export default IncidentsTab;
