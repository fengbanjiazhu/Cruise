import React, { useState } from "react";

function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-[5rem]">Welcome Back Admin!</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* -=-=-=-=-=-=-=-=-=-=- Tab Navigation -=-=-==-=-=-=-=-==-=-=-=-*/}
        <div className="flex border-b gap-5 px-[2rem] py-[1rem]">
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "dashboard"
                ? "border-b-2  text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "users"
                ? "border-b-2  text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`px-6 py-3   font-medium text-sm ${
              activeTab === "incidents"
                ? "border-b-2  text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("incidents")}
          >
            Incidents
          </button>
        </div>

        {/* -=-=-=-=-=-=-=-=-=-=- Tab Content -=-=-==-=-=-=-=-==-=-=-=-*/}
        <div className="p-6">
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-950">
                Dashboard
              </h2>
              <p className="text-gray-600">
                New tickets, general statistics, and other data will be
                displayed.
              </p>
            </div>
          )}
          {activeTab === "users" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-950">
                User Management
              </h2>
              <p className="text-gray-600">
                User list and management functionality will be displayed here.
              </p>
            </div>
          )}

          {activeTab === "incidents" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-950">
                Incident Reports
              </h2>
              <p className="text-gray-600">
                Incident reporting and tracking functionality will be displayed
                here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
