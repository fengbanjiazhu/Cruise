import {
  validatePasswordChange,
  updatePasswordAPI,
  validateEmailChange,
} from "../../components/Profiles/updateprofile";

import * as api from "../../utils/api";

jest.spyOn(api, "checkEmail").mockResolvedValue({ exist: true });

test("returns error if email already exists", async () => {
  const result = await validateEmailChange("taken@example.com", "current@example.com");
  expect(result.error).toBe("This email is already taken");
});

test("returns error if email is empty", async () => {
  const result = await validateEmailChange("", "current@example.com");
  expect(result.error).toBe("Email cannot be empty");
});

test("returns error if email unchanged", async () => {
  const result = await validateEmailChange("current@example.com", "current@example.com");
  expect(result.error).toBe("Email unchanged");
});

describe("Password Update Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows error if passwords are empty", () => {
    const errors = validatePasswordChange({ currentPassword: "", newPassword: "" });
    expect(errors.password).toBe("Please fill in both current and new password");
  });

  test("no error if passwords filled", () => {
    const errors = validatePasswordChange({ currentPassword: "123", newPassword: "456" });
    expect(errors).toEqual({});
  });

  test("calls fetchPost correctly when password update succeeds", async () => {
    jest.spyOn(api, "fetchPost").mockResolvedValue({ data: "ok" });

    const res = await updatePasswordAPI("old123", "new123", "token123");

    expect(api.fetchPost).toHaveBeenCalledWith(
      "user/update-password",
      expect.objectContaining({
        method: "PATCH",
        headers: expect.any(Object),
        body: expect.any(String),
      })
    );
    expect(res).toEqual({ data: "ok" });
  });

  test("handles wrong password correctly", async () => {
    jest.spyOn(api, "fetchPost").mockRejectedValue({
      response: { status: 401, data: { message: "Wrong password" } },
    });

    await expect(updatePasswordAPI("wrongPass", "new123", "token123")).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(api.fetchPost).toHaveBeenCalledWith(
      "user/update-password",
      expect.objectContaining({
        method: "PATCH",
        headers: expect.any(Object),
        body: expect.any(String),
      })
    );
  });
});
