import { updateCurrentUser } from "../Controllers/userController.js";

import * as authController from "../Controllers/authController.js"; 
import User from "../Models/userModel.js";
import { updatePasswordLogic } from "../Controllers/authController.js";
import { checkEmail } from "../Controllers/userController.js";





describe("updateCurrentUser & updatePassword", () => {
  let res, next;

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();

    
    jest.spyOn(authController, "correctPassword").mockImplementation(async (typed, db) => typed === db);
    jest.spyOn(authController, "hashPassword").mockImplementation(async (pw) => `hashed-${pw}`);
  });

  it("checkEmail returns true if email exists", async () => {
  const req = { query: { email: "existing@example.com" } };

  // Mock User.findOne to simulate existing email
  jest.spyOn(User, "findOne").mockResolvedValue({ _id: "123", email: "existing@example.com" });

  await checkEmail(req, res, next);

  expect(User.findOne).toHaveBeenCalledWith({ email: "existing@example.com" });
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ exists: true });
});

  it("updateCurrentUser updates name/email", async () => {
    const req = { user: { _id: "123" }, body: { name: "New Name", email: "new@example.com" } };

    jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue(req.body);

    await updateCurrentUser(req, res, next);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      req.body,
      expect.objectContaining({ new: true, runValidators: true })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: "success", data: { data: req.body } });
  });

  it("updatePassword succeeds with correct old password", async () => {
    const req = {
      user: { _id: "123" },
      body: { oldPassword: "oldPass123", newPassword: "newPass456", newPasswordConfirm: "newPass456" },
    };

    
    jest.spyOn(User, "findById").mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ _id: "123", password: "oldPass123" }),
    }));
    jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue({ _id: "123", password: "hashed-newPass456" });

    await updatePasswordLogic(req, res, next);

    expect(authController.correctPassword).toHaveBeenCalledWith("oldPass123", "oldPass123");
    expect(authController.hashPassword).toHaveBeenCalledWith("newPass456");
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      { password: "hashed-newPass456" },
      { new: true, runValidators: false }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: "success", message: "Password updated successfully" });
    expect(next).not.toHaveBeenCalled();
  });

  it("updatePassword fails with wrong old password", async () => {
    const req = {
      user: { _id: "123" },
      body: { oldPassword: "wrongOld", newPassword: "newPass456", newPasswordConfirm: "newPass456" },
    };

    jest.spyOn(User, "findById").mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ _id: "123", password: "oldPass123" }),
    }));

    await updatePasswordLogic(req, res, next);

    expect(authController.correctPassword).toHaveBeenCalledWith("wrongOld", "oldPass123");
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Your current password is incorrect", statusCode: 401 })
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
