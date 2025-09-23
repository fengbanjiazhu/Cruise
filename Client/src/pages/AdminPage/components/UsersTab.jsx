import React from "react";
import Pill from "./Pill";
import { mockUsers } from "../utils/mockData";
import { formatDate, statusPillClass } from "../utils/formatters";

function UsersTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-950">User Management</h2>
        <button className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors duration-200">
          + Add User
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Last Active
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {mockUsers.map((u) => (
              <tr key={u.id}>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                  {u.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                  {u.email}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                  {u.role}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <Pill className={statusPillClass(u.status)}>{u.status}</Pill>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                  {formatDate(u.lastActive)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button className="rounded-lg bg-white border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        Mock data only — wire this to Firestore when ready.
      </p>
    </div>
  );
}

export default UsersTab;
