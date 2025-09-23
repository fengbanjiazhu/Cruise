import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { hashPassword, correctPassword, signToken } from "../Controllers/authController.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./Server/config.env" });
}

describe("Auth Utilities", () => {
  const password = "mypassword";

  it("hashPassword should return a hashed string", async () => {
    const hashed = await hashPassword(password);
    expect(hashed).not.toBe(password);
  });

  it("correctPassword should return true for correct password", async () => {
    const hashed = await hashPassword(password);
    const result = await correctPassword(password, hashed);
    expect(result).toBe(true);
  });

  it("correctPassword should return false for incorrect password", async () => {
    const hashed = await hashPassword(password);
    const result = await correctPassword("wrong_password", hashed);
    expect(result).toBe(false);
  });
});

describe("JWT token encryption and decryption", () => {
  const mockUser = { _id: "12345" };

  it("should generate and verify a token", async () => {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined!");

    const token = signToken(mockUser);

    expect(typeof token).toBe("string");

    const result = await jwt.verify(token, process.env.JWT_SECRET);
    expect(result).toHaveProperty("id", mockUser._id);
  });

  it("should fail with invalid token", async () => {
    const invalidToken = "invalid_token_value";
    expect(() => jwt.verify(invalidToken, process.env.JWT_SECRET)).toThrow();
  });

  it("should throw TokenExpiredError for an expired token", async () => {
    const token = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET, { expiresIn: "1s" });

    await new Promise((e) => setTimeout(e, 2000));

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      throw new Error("Token should have expired");
    } catch (err) {
      expect(err).toBeInstanceOf(jwt.TokenExpiredError);
    }
  });
});
