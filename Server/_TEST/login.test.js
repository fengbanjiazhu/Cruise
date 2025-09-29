import axios from "axios";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./Server/config.env" });
}

const API_URL = "http://localhost:8000/api/";
const password = process.env.TEST_USER_PASSWORD;

let token;

describe("Auth API", () => {
  it("should fail login with wrong password", async () => {
    await expect(
      axios.post(`${API_URL}user/login`, {
        email: "jeff2@test.com",
        password: "wrong_password_making_no_sense",
      })
    ).rejects.toHaveProperty("response.status", 401);
  });

  it("should login successfully and get a token", async () => {
    const res = await axios.post(`${API_URL}user/login`, {
      email: "jeff2@test.com",
      password,
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("token");

    token = res.data.token;
  });
});

describe("Favorite List API", () => {
  beforeAll(async () => {
    if (!token) {
      const res = await axios.post(`${API_URL}user/login`, { email: "jeff2@test.com", password });
      token = res.data.token;
    }
  });

  it("should fail remove path to list without a token", async () => {
    await expect(
      axios.delete(`${API_URL}user/list`, {
        data: { pathid: "68b41827015cdced49eabf39" },
      })
    ).rejects.toMatchObject({
      response: {
        status: 401,
        data: { message: "You are not logged in, please login first" },
      },
    });
  });

  it("should add to list successfully with a token", async () => {
    const res = await axios.patch(
      `${API_URL}user/list`,
      { pathid: "68b41827015cdced49eabf39" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    expect(res.status).toBe(200);
  });
});
