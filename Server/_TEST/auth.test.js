import { restrictTo } from "../Controllers/authController.js";

describe("restrictTo middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { _id: "12345" } };
    res = {};
    next = jest.fn();
  });

  it("calls next with error if role not allowed", () => {
    req.user.role = "user";
    restrictTo("admin", "manager")(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "You do not have permission to perform this action",
        statusCode: 403,
      })
    );
  });

  it("should call next without error if user role is allowed", () => {
    req.user.role = "admin";
    const middleware = restrictTo("admin", "manager");

    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});
