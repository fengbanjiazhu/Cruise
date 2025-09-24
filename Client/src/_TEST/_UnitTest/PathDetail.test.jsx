import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PathDetail from "../../pages/PathDetail";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "../../store/slices/userInfoSlice";
import { MemoryRouter } from "react-router-dom";

// Define store for all tests
const store = configureStore({
  reducer: { userInfo: userInfoReducer },
  preloadedState: {
    userInfo: { user: { _id: "u1" }, token: null, isLoggedIn: true, loadingUser: false },
  },
});

// Mock react-router-dom useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ pathID: "123" }),
}));

// Mock API fetchGet
jest.mock("../../utils/api", () => ({
  fetchGet: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          _id: "123",
          name: "Test Path",
          description: "A test path description.",
          profile: "foot",
          duration: 42,
          creator: "u1",
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
    // Mock fetch for PATCH
    global.fetch = jest.fn((url, opts) => {
      if (opts.method === "PATCH") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      // fallback to GET
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { data: {} } }) });
    });
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
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/path/"),
        expect.objectContaining({ method: "PATCH" })
      )
    );
    // Success: PATCH called
  });

  test("delete button sends DELETE and redirects", async () => {
    // Mock fetch for DELETE
    global.fetch = jest.fn((url, opts) => {
      if (opts.method === "DELETE") {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      // fallback to GET
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { data: {} } }) });
    });
    // Mock window.confirm to always return true
    window.confirm = jest.fn(() => true);
    // Mock window.alert to silence jsdom errors
    window.alert = jest.fn();
    // Mock window.location.reload to silence jsdom errors
    delete window.location;
    // window.location = { reload: jest.fn() };
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
    // Should call fetch with DELETE
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/path/"),
        expect.objectContaining({ method: "DELETE" })
      )
    );
    // Success: DELETE called
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
