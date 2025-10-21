import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PathDetail from "../../pages/PathDetail.jsx";
// Mock Leaflet Routing Machine to prevent real network requests
jest.mock("leaflet-routing-machine");

// Mock fetchPost and optionMaker for PATCH/DELETE
jest.mock("../../utils/api", () => ({
  ...jest.requireActual("../../utils/api"),
  fetchGet: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          _id: "123",
          name: "Test Path",
          description: "A test path description.",
          profile: "foot",
          duration: 42,
          creator: { _id: "u1" },
          waypoints: [
            { lat: 1, lng: 2, label: "Start" },
            { lat: 3, lng: 4, label: "End" },
          ],
          locations: [
            { lat: 1, lng: 2 },
            { lat: 3, lng: 4 },
          ],
        },
      },
    })
  ),
  fetchPost: jest.fn(),
  optionMaker: jest.fn(),
}));

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "../../store/slices/mapSlice";
import userInfoReducer from "../../store/slices/userInfoSlice";
import { MemoryRouter } from "react-router-dom";

// Define store for all tests
const store = configureStore({
  reducer: { userInfo: userInfoReducer, mapURL: mapReducer },
  preloadedState: {
    userInfo: { user: { _id: "u1" }, token: null, isLoggedIn: true, loadingUser: false },
  },
});

// Mock react-router-dom useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ pathID: "123" }),
}));

// UI tests

describe("PathDetail UI", () => {
  test("renders loading, then path details", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PathDetail />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Loading path/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /Test Path/i })).toBeInTheDocument()
    );
    expect(screen.getByText(/A test path description/i)).toBeInTheDocument();
    expect(screen.getByText(/Unknown/i)).toBeInTheDocument();
    expect(screen.getByText(/42 min/i)).toBeInTheDocument();
    expect(screen.getByText(/foot/i)).toBeInTheDocument();
    expect(screen.getByText(/Waypoints:/i)).toBeInTheDocument();
    expect(screen.getByText(/Start/i)).toBeInTheDocument();
    expect(screen.getByText(/End/i)).toBeInTheDocument();
  });

  test("shows error if fetch fails", async () => {
    // Override fetchGet to throw
    const { fetchGet } = require("../../utils/api");
    fetchGet.mockImplementationOnce(() => Promise.reject(new Error("Fetch error")));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PathDetail />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => expect(screen.getByText(/Fetch error/i)).toBeInTheDocument());
  });
  test("edit modal PATCHes path and reloads on success", async () => {
    // Mock fetchPatch and optionMaker
    const { fetchPost, optionMaker } = require("../../utils/api");
    fetchPost.mockImplementationOnce(() =>
      Promise.resolve({ data: { data: { _id: "123", name: "Edited Path" } } })
    );
    optionMaker.mockImplementation((data, method, token) => ({
      method,
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    }));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PathDetail />
        </MemoryRouter>
      </Provider>
    );
    // Open edit modal
    await waitFor(() => screen.getByRole("button", { name: /Edit Path/i }));
    fireEvent.click(screen.getByRole("button", { name: /Edit Path/i }));
    // Change name
    fireEvent.change(screen.getByLabelText(/Route name/i), { target: { value: "Edited Path" } });
    // Save changes
    fireEvent.click(screen.getByText(/Save Changes/i));
    await waitFor(() => {
      expect(fetchPost).toHaveBeenCalled();
      const calls = optionMaker.mock.calls;
      expect(
        calls.some(([payload, method]) => method === "PATCH" && payload.name === "Edited Path")
      ).toBe(true);
    });
  });

  test("delete button sends DELETE and redirects", async () => {
    // Mock fetchPost and optionMaker for DELETE
    const { fetchPost, optionMaker } = require("../../utils/api");
    fetchPost.mockImplementationOnce(() => Promise.resolve({ data: { data: {} } }));
    optionMaker.mockImplementation((data, method, token) => ({
      method,
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    }));
    window.confirm = jest.fn(() => true);
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PathDetail />
        </MemoryRouter>
      </Provider>
    );
    // Click delete
    await waitFor(() => screen.getByRole("button", { name: /Delete Path/i }));
    fireEvent.click(screen.getByRole("button", { name: /Delete Path/i }));
    await waitFor(() => {
      expect(fetchPost).toHaveBeenCalled();
      const calls = optionMaker.mock.calls;
      expect(
        calls.some(([payload, method]) => method === "DELETE" && payload.pathID === "123")
      ).toBe(true);
    });
  });
});

// Fetch by Object function test
import { fetchGet } from "../../utils/api";
describe("PathDetail fetchGet", () => {
  test("fetches path object by ID", async () => {
    const result = await fetchGet("path/123", {});
    expect(result.data.data._id).toBe("123");
    expect(result.data.data.name).toBe("Test Path");
  });
});
