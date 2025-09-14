import React, { useEffect, useState } from "react";
import Pill from "./Pill";
import { statusPillClass } from "../utils/formatters";
import { getAllUsers } from "../../../utils/api";
import { useSelector } from "react-redux";

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token: reduxToken, isLoggedIn } = useSelector(
    (state) => state.userInfo
  );

  // Fallback to localStorage if Redux token is not available
  const getToken = () => {
    if (reduxToken) return reduxToken;
    return localStorage.getItem("jwt");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getToken();
        console.log(
          "Starting user fetch with token:",
          token ? "Token exists" : "No token found"
        );
        setLoading(true);

        if (!token) {
          console.warn("No authentication token available");
          setError("Authentication required. Please login again.");
          setLoading(false);
          return;
        }

        const userData = await getAllUsers(token);
        console.log("Users data received:", userData);

        // Handle different response formats based on the central controller pattern
        let usersArray = [];
        if (userData?.data?.data && Array.isArray(userData.data.data)) {
          // Format from centralController.js getAll function
          usersArray = userData.data.data;
        } else if (Array.isArray(userData)) {
          usersArray = userData;
        } else if (userData?.data && Array.isArray(userData.data)) {
          usersArray = userData.data;
        }

        if (usersArray.length > 0) {
          setUsers(usersArray);
          setError(null);
        } else {
          console.warn("Empty or invalid user data received:", userData);
          setUsers([]);
          setError("No user data available or you may not have permission.");
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(`Failed to load users: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [reduxToken, isLoggedIn]);

  // Rest of the component remains the same
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                  {error}
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id || u.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {u.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                    {u.email}
                  </td>
                  <td className="whitespace-nowrap py-3 text-sm text-gray-700 px-4">
                    {u.role}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 flex items-center justify-between">
                    <Pill className={statusPillClass(u.status || "active")}>
                      {u.status || "active"}
                    </Pill>
                    <button className="ml-4 rounded-lg bg-white border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200">
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!error && !loading && (
        <p className="mt-3 text-xs text-gray-500">
          Showing {users.length} users from database
        </p>
      )}
    </div>
  );
}

export default UsersTab;
