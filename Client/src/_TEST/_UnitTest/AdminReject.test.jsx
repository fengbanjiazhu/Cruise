// John Lin
// AdminReject.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "../../store/slices/userInfoSlice";
import adminReducer from "../../store/slices/adminSlice";
import IncidentsTab from "../../pages/AdminPage/components/IncidentsTab";

jest.mock("framer-motion", () => {
  const actual = jest.requireActual("framer-motion");
  return {
    __esModule: true,
    ...actual,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      button: ({ children, ...props }) => <button {...props}>{children}</button>,
      tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

jest.mock("../../pages/AdminPage/components/IncidentDetailModal", () => {
  return function MockIncidentDetailModal({ incident, isOpen, onClose }) {
    if (!isOpen) return null;
    return (
      <div data-testid="incident-modal">
        <h2>Incident Details</h2>
        <p>Title: {incident?.title}</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock("../../pages/AdminPage/components/Pill", () => {
  return function MockPill({ children, className }) {
    return <span className={className}>{children}</span>;
  };
});

jest.mock("../../pages/AdminPage/utils/formatters", () => ({
  formatDate: jest.fn((_date) => "Mocked Date"),
  incidentSeverityClass: jest.fn((_severity) => "mocked-severity-class"),
  incidentStatusClass: jest.fn((_status) => "mocked-status-class"),
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

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

import { fetchGet, fetchDelete } from "../../utils/api";

const mockIncidents = [
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
];

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

describe("Admin Incident Management - Rejection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchGet.mockResolvedValue(mockIncidents);
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
});
