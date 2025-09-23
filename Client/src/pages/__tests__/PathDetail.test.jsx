import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import PathDetail from "../PathDetail";

// Mock react-router-dom useParams
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ pathID: "123" }),
}));

// Mock API fetchGet
jest.mock("../../utils/api", () => ({
  fetchGet: jest.fn(() => Promise.resolve({
    data: {
      data: {
        _id: "123",
        name: "Test Path",
        description: "A test path description.",
        profile: "foot",
        duration: 42,
        creator: { name: "Test User" },
        waypoints: [
          { lat: 1, lng: 2, label: "Start" },
          { lat: 3, lng: 4, label: "End" }
        ],
        locations: [
          { lat: 1, lng: 2 },
          { lat: 3, lng: 4 }
        ]
      }
    }
  }))
}));

// UI tests

describe("PathDetail UI", () => {
  test("renders loading, then path details", async () => {
    render(<PathDetail />);
    expect(screen.getByText(/Loading path/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('heading', { name: /Test Path/i })).toBeInTheDocument());
    expect(screen.getByText(/A test path description/i)).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
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
    render(<PathDetail />);
  await waitFor(() => expect(screen.getByText(/Fetch error/i)).toBeInTheDocument());
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
