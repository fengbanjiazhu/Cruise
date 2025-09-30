import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PathDetail from "../../pages/PathDetail.jsx";

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
import userInfoReducer from "../../store/slices/userInfoSlice.js";
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
    expect(screen.getByText(/Write your review.../i)).toBeInTheDocument();
    expect(screen.getByText(/Submit Review/i)).toBeInTheDocument();
  });

});
