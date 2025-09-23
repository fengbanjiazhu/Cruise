import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AllPaths from "../../pages/AllPaths";

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
    render(<AllPaths />);
    expect(screen.getByText(/Loading paths/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Path 1")).toBeInTheDocument());
  });

  it("shows error on API failure", async () => {
    fetchGet.mockRejectedValue(new Error("API error"));
    render(<AllPaths />);
    await waitFor(() => expect(screen.getByText(/API error/i)).toBeInTheDocument());
  });
});
