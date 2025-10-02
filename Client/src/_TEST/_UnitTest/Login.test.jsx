import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../pages/Login.jsx";
import * as api from "../../utils/api";
import toast from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { MemoryRouter } from "react-router-dom";

jest.mock("@/assets/bg.jpg", () => "test-bg.jpg");

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Login Component", () => {
  test("successful login calls fetchPost and shows success toast", async () => {
    const fakeData = { token: "abc123", name: "Jeff" };
    jest.spyOn(api, "fetchPost").mockResolvedValue(fakeData);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "123@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(api.fetchPost).toHaveBeenCalledWith("user/login", expect.any(Object))
    );

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Successfully logged in"));
  });

  test("invalid email shows toast error", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    const emailInput = screen.getByPlaceholderText("Email");

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Email is not valid"));
  });

  test("failed login shows toast error", async () => {
    jest.spyOn(api, "fetchPost").mockRejectedValue(new Error("Wrong credentials"));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "123@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "111000" },
    });
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => expect(api.fetchPost).toHaveBeenCalled());
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Wrong credentials"));
  });
});
