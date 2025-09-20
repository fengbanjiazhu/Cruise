import React, { useState } from "react";
import UsersTab from "./components/UsersTab";
import IncidentsTab from "./components/IncidentsTab";
import PathsTab from "./components/PathsTab";

function Admin() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-[5rem]">Welcome Back Admin!</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* -=-=-=-=-=-=-=-=-=-=- Tab Navigation -=-=-==-=-=-=-=-==-=-=-=-*/}
        <div className="flex border-b gap-5 px-[2rem] py-[1rem] bg-gray-50">
          <button
            className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === "users"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === "incidents"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
            }`}
            onClick={() => setActiveTab("incidents")}
          >
            Incidents
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === "paths"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
            }`}
            onClick={() => setActiveTab("paths")}
          >
            Paths
          </button>
        </div>

        {/* -=-=-=-=-=-=-=-=-=-=- Tab Content -=-=-==-=-=-=-=-==-=-=-=-*/}
        <div className="p-6">
          {activeTab === "users" && <UsersTab />}
          {activeTab === "incidents" && <IncidentsTab />}
          {activeTab === "paths" && <PathsTab />}
        </div>
      </div>
    </div>
  );
}

export default Admin;
