import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateReview from "../../pages/createReview";
import { fetchGet, fetchPost } from "../../utils/api";

jest.mock("../../utils/api", () => ({
  fetchGet: jest.fn(),
  fetchPost: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(window.location, "reload").mockImplementation(() => {});
});

describe("CreateReview", () => {
  const pathId = "p1";
  const userId = "u1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form for new review when no existing review", async () => {
    // Make fetchGet reject (no review found)
    fetchGet.mockRejectedValueOnce(new Error("No review"));

    render(<CreateReview pathId={pathId} userId={userId} />);

    expect(await screen.findByPlaceholderText("Write your review...")).toBeInTheDocument();
    expect(screen.getByText("Submit Review")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  test("renders form with existing review data", async () => {
    fetchGet.mockResolvedValueOnce({
      data: {
        data: {
          id: "r1",
          review: "Great path!",
          rating: 4,
        },
      },
    });

    render(<CreateReview pathId={pathId} userId={userId} />);

    expect(await screen.findByDisplayValue("Great path!")).toBeInTheDocument();
    expect(screen.getByDisplayValue("4")).toBeInTheDocument();
    expect(screen.getByText("Update Review")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("submits new review", async () => {
    fetchGet.mockRejectedValueOnce(new Error("No review")); // no review initially
    fetchPost.mockResolvedValueOnce({ data: { message: "created" } });

    render(<CreateReview pathId={pathId} userId={userId} />);

    const textarea = await screen.findByPlaceholderText("Write your review...");
    fireEvent.change(textarea, { target: { value: "My review" } });
    fireEvent.click(screen.getByText("Submit Review"));

    await waitFor(() =>
      expect(fetchPost).toHaveBeenCalledWith("review/CreateReview", expect.any(Object))
    );
    expect(window.location.reload).toHaveBeenCalled();
  });

  test("updates existing review", async () => {
    fetchGet.mockResolvedValueOnce({
      data: {
        data: { id: "r1", review: "Old review", rating: 3 },
      },
    });
    fetchPost.mockResolvedValueOnce({ data: { message: "updated" } });

    render(<CreateReview pathId={pathId} userId={userId} />);

    const textarea = await screen.findByDisplayValue("Old review");
    fireEvent.change(textarea, { target: { value: "Updated review" } });
    fireEvent.click(screen.getByText("Update Review"));

    await waitFor(() =>
      expect(fetchPost).toHaveBeenCalledWith("review/r1", expect.any(Object))
    );
  });

  test("deletes existing review", async () => {
    fetchGet.mockResolvedValueOnce({
      data: {
        data: { id: "r1", review: "Old review", rating: 3 },
      },
    });
    fetchPost.mockResolvedValueOnce({ data: { message: "deleted" } });

    render(<CreateReview pathId={pathId} userId={userId} />);

    fireEvent.click(await screen.findByText("Delete"));

    await waitFor(() =>
      expect(fetchPost).toHaveBeenCalledWith("review/r1", { method: "DELETE" })
    );
    expect(window.location.reload).toHaveBeenCalled();
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});