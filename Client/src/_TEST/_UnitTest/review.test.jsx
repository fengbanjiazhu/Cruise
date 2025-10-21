import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateReview from "../../components/Review/createReview";
import * as api from "../../utils/api";

describe("CreateReview", () => {
  const pathId = "p1";
  const userId = "u1";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders form for new review when no existing review", async () => {
    // Make fetchGet reject (no review found)
    jest.spyOn(api, "fetchGet").mockResolvedValue(new Error("No review"));

    render(<CreateReview pathId={pathId} userId={userId} />);

    expect(await screen.findByPlaceholderText("Write your review...")).toBeInTheDocument();
    expect(screen.getByText("Submit Review")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  test("renders form with existing review data", async () => {
    api.fetchGet.mockResolvedValueOnce({
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
    expect(screen.getByText("Update Review")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("submits new review", async () => {
    jest.spyOn(api, "fetchGet").mockResolvedValue(new Error("No review"));
    jest.spyOn(api, "fetchPost").mockResolvedValue({ data: { message: "created" } });

    render(<CreateReview pathId={pathId} userId={userId} />);

    const textarea = await screen.findByPlaceholderText("Write your review...");
    fireEvent.change(textarea, { target: { value: "My review" } });
    fireEvent.click(screen.getByText("Submit Review"));

    await waitFor(() =>
      expect(api.fetchPost).toHaveBeenCalledWith("review/CreateReview", expect.any(Object))
    );
    // expect(window.location.reload).toHaveBeenCalled();
  });

  test("updates existing review", async () => {
    jest.spyOn(api, "fetchGet").mockResolvedValue({
      data: {
        data: { id: "r1", review: "Old review", rating: 3 },
      },
    });
    jest.spyOn(api, "fetchPost").mockResolvedValue({ data: { message: "updated" } });

    render(<CreateReview pathId={pathId} userId={userId} />);

    const textarea = await screen.findByDisplayValue("Old review");
    fireEvent.change(textarea, { target: { value: "Updated review" } });
    fireEvent.click(screen.getByText("Update Review"));

    await waitFor(() =>
      expect(api.fetchPost).toHaveBeenCalledWith("review/r1", expect.any(Object))
    );
  });

  test("deletes existing review", async () => {
    jest.spyOn(api, "fetchGet").mockResolvedValue({
      data: {
        data: { id: "r1", review: "Old review", rating: 3 },
      },
    });

    jest.spyOn(api, "fetchPost").mockResolvedValue({ data: { message: "deleted" } });

    render(<CreateReview pathId={pathId} userId={userId} />);

    fireEvent.click(await screen.findByText("Delete"));

    await waitFor(() =>
      expect(api.fetchPost).toHaveBeenCalledWith("review/r1", { method: "DELETE" })
    );
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});
