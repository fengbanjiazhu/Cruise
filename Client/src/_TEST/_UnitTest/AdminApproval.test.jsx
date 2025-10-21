// John Lin
// IncidentManagement.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "../../store/slices/userInfoSlice";
import adminReducer from "../../store/slices/adminSlice";
import IncidentsTab from "../../pages/AdminPage/components/IncidentsTab";

// Mock Redux dispatch
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

// Mock API functions
jest.mock("../../utils/api", () => ({
  API_ROUTES: {
    incident: {
      getAll: "incidents/",
      update: (id) => `incidents/${id}`,
      delete: (id) => `incidents/${id}`,
    },
  },
  API_URL: "http://localhost:8000/api/",
  fetchGet: jest.fn(),
  fetchPost: jest.fn(),
  fetchDelete: jest.fn(),
}));

import { fetchGet, fetchPost, fetchDelete } from "../../utils/api";

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      userInfo: userInfoReducer,
      admin: adminReducer,
    },
    preloadedState: {
      userInfo: {
        user: { _id: "admin1", role: "admin" },
        token: "admin-token",
        isLoggedIn: true,
        loadingUser: false,
        ...initialState.userInfo,
      },
      admin: {
        refreshPaths: 0,
        refreshIncidents: 0,
        ...initialState.admin,
      },
    },
  });
};

describe("Admin Incident Management", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    fetchGet.mockResolvedValue([
      {
        id: "inc1",
        title: "Road Closure",
        severity: "high",
        status: "pending",
        createdAt: "2025-09-25T10:30:00Z",
        updatedAt: "2025-09-25T10:30:00Z",
        targetId: "path123",
        targetType: "path",
        description: "Major road closure due to construction",
        reportedBy: "user1",
        assignee: "admin1",
      },
      {
        id: "inc2",
        title: "Traffic Accident",
        severity: "medium",
        status: "pending",
        createdAt: "2025-09-26T09:15:00Z",
        updatedAt: "2025-09-26T09:15:00Z",
        targetId: "path456",
        targetType: "path",
        description: "Traffic accident causing delays",
        reportedBy: "user2",
        assignee: "admin1",
      },
    ]);
  });

  it("renders the incidents tab with pending incidents", async () => {
    render(
      <Provider store={createMockStore()}>
        <IncidentsTab />
      </Provider>
    );

    await waitFor(() => {
      expect(fetchGet).toHaveBeenCalledWith("incidents/", expect.any(Object));
      expect(screen.getByText("Road Closure")).toBeInTheDocument();
      expect(screen.getByText("Traffic Accident")).toBeInTheDocument();
    });

    expect(screen.getAllByText("Approve").length).toBe(2);
    expect(screen.getAllByText("Reject").length).toBe(2);
  });

  it("allows admin to approve an incident", async () => {
    fetchPost.mockResolvedValue({ status: "success" });

    render(
      <Provider store={createMockStore()}>
        <IncidentsTab />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Road Closure")).toBeInTheDocument();
    });

    const approveButtons = screen.getAllByText("Approve");
    fireEvent.click(approveButtons[0]);

    await waitFor(() => {
      expect(fetchPost).toHaveBeenCalledWith(
        "incidents/inc1",
        expect.objectContaining({
          method: "PATCH",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ status: "approved" }),
        })
      );
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("allows admin to reject an incident", async () => {
    fetchDelete.mockResolvedValue({ status: "success" });

    render(
      <Provider store={createMockStore()}>
        <IncidentsTab />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Traffic Accident")).toBeInTheDocument();
    });

    const rejectButtons = screen.getAllByText("Reject");
    fireEvent.click(rejectButtons[1]);

    expect(screen.getByText("Confirm Rejection")).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to reject incident inc2?/)).toBeInTheDocument();

    const confirmButton = screen.getByText("Reject Incident");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(fetchDelete).toHaveBeenCalledWith(
        "incidents/inc2",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });
  });

  it("handles API errors when approving incidents", async () => {
    const errorMessage = "Server error: Could not approve incident";
    fetchPost.mockRejectedValue(new Error(errorMessage));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <Provider store={createMockStore()}>
        <IncidentsTab />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Road Closure")).toBeInTheDocument();
    });

    // Find the approve button and click it
    const approveButtons = screen.getAllByText("Approve");
    fireEvent.click(approveButtons[0]);

    await waitFor(() => {
      expect(fetchPost).toHaveBeenCalled();
      expect(screen.getByText(/Failed to approve incident/)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("handles API errors when rejecting incidents", async () => {
    const errorMessage = "Server error: Could not reject incident";
    fetchDelete.mockRejectedValue(new Error(errorMessage));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <Provider store={createMockStore()}>
        <IncidentsTab />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Traffic Accident")).toBeInTheDocument();
    });

    const rejectButtons = screen.getAllByText("Reject");
    fireEvent.click(rejectButtons[1]);

    const confirmButton = screen.getByText("Reject Incident");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(fetchDelete).toHaveBeenCalled();
      expect(screen.getByText(/Failed to reject incident/)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("cancels incident rejection when Cancel button is clicked", async () => {
    render(
      <Provider store={createMockStore()}>
        <IncidentsTab />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Traffic Accident")).toBeInTheDocument();
    });

    const rejectButtons = screen.getAllByText("Reject");
    fireEvent.click(rejectButtons[1]);

    expect(screen.getByText("Confirm Rejection")).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Confirm Rejection")).not.toBeInTheDocument();
    });
    expect(fetchDelete).not.toHaveBeenCalled();
  });

  it("shows different tabs for active and locked incidents", async () => {
    fetchGet.mockResolvedValue([
      {
        id: "inc1",
        title: "Road Closure",
        severity: "high",
        status: "pending",
        createdAt: "2025-09-25T10:30:00Z",
        updatedAt: "2025-09-25T10:30:00Z",
      },
      {
        id: "inc2",
        title: "Traffic Accident",
        severity: "medium",
        status: "approved",
        createdAt: "2025-09-26T09:15:00Z",
        updatedAt: "2025-09-26T09:15:00Z",
      },
      {
        id: "inc3",
        title: "Pothole",
        severity: "low",
        status: "rejected",
        createdAt: "2025-09-27T11:20:00Z",
        updatedAt: "2025-09-27T11:20:00Z",
      },
    ]);

    render(
      <Provider store={createMockStore()}>
        <IncidentsTab />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Road Closure")).toBeInTheDocument();
      expect(screen.queryByText("Traffic Accident")).not.toBeInTheDocument(); // Not visible in Active tab
    });

    const lockedTab = screen.getByText(/Locked/);
    fireEvent.click(lockedTab);

    await waitFor(() => {
      expect(screen.queryByText("Road Closure")).not.toBeInTheDocument(); // Not visible in Locked tab
      expect(screen.getByText("Traffic Accident")).toBeInTheDocument();
      expect(screen.getByText("Pothole")).toBeInTheDocument();
    });
  });
});
