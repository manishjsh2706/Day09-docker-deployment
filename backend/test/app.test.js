const request =
require("supertest");

const app =
require("../server");

describe("Health API",()=>{

test("GET /",async()=>{

const response =
await request(app)
.get("/");

expect(response.statusCode)
.toBe(200);

});

});
