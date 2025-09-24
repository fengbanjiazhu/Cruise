import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AllPaths from "../../pages/AllPaths";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "../../store/slices/userInfoSlice";
import { MemoryRouter } from "react-router-dom";

const store = configureStore({
  reducer: { userInfo: userInfoReducer },
  preloadedState: {
    userInfo: { user: { _id: "u1" }, token: null, isLoggedIn: true, loadingUser: false },
  },
});

// Mock fetchGet utility
jest.mock("../../utils/api", () => ({
  fetchGet: jest.fn(),
}));

import { fetchGet } from "../../utils/api";

describe("AllPaths", () => {
  it("shows loading and then displays paths", async () => {
    fetchGet.mockResolvedValue({
      data: {
        data: [
          {
            _id: "1",
            name: "Path 1",
            profile: "urban",
            description: "Desc",
            duration: 10,
            creator: { name: "Alice" },
          },
        ],
      },
    });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AllPaths />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Loading paths/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Path 1")).toBeInTheDocument());
  });

  it("shows error on API failure", async () => {
    fetchGet.mockRejectedValue(new Error("API error"));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AllPaths />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => expect(screen.getByText(/API error/i)).toBeInTheDocument());
  });
});
