const app = require("../app");
const request = require("supertest");

describe("Health API", () => {
  test("GET /", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
