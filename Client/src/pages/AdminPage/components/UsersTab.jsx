import React, { useEffect, useState } from "react";
import Pill from "./Pill";
import { statusPillClass } from "../utils/formatters";
import { getAllUsers } from "../../../utils/api";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token: reduxToken, isLoggedIn } = useSelector(
    (state) => state.userInfo
  );

  // Smooth animation variants (mirroring IncidentsTab)
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

  const getToken = () => {
    if (reduxToken) return reduxToken;
    return localStorage.getItem("jwt");
  };

  // Rest of the component remains the same
  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div
        className="flex items-center justify-between mb-4"
        variants={itemVariants}
      >
        <h2 className="text-xl font-semibold text-gray-950">User Management</h2>
        <motion.button
          className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-blue-700 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          + Add User
        </motion.button>
      </motion.div>

      <motion.div
        className="overflow-x-auto rounded-lg border"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
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
            <AnimatePresence>
              {loading ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Loading users...
                  </td>
                </motion.tr>
              ) : error ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    {error}
                  </td>
                </motion.tr>
              ) : users.length > 0 ? (
                users.map((u, index) => (
                  <motion.tr
                    key={u._id || u.id}
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
                      <motion.button
                        className="ml-4 rounded-lg bg-white border border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        View
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
      {!error && !loading && (
        <motion.p
          className="mt-3 text-xs text-gray-500"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          Showing {users.length} users from database
        </motion.p>
      )}
    </motion.div>
  );
}

export default UsersTab;
