import React, { useState } from "react";
import UsersTab from "./components/UsersTab";
import IncidentsTab from "./components/IncidentsTab";

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
              activeTab === "users"
                ? "border-b-2 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "incidents"
                ? "border-b-2 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("incidents")}
          >
            Incidents
          </button>
        </div>

        {/* -=-=-=-=-=-=-=-=-=-=- Tab Content -=-=-==-=-=-=-=-==-=-=-=-*/}
        <div className="p-6">
          {activeTab === "users" && <UsersTab />}
          {activeTab === "incidents" && <IncidentsTab />}
        </div>
      </div>
    </div>
  );
}

export default Admin;
