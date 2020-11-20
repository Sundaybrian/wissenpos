const request = require("supertest");
const app = require("../../app");
const User = require("../user/user.model");
const Role = require("../../utils/role");

describe("POST /api/v1/auth/register", () => {
    it("should fail to create a user with missing fields", async () => {
        await request(app)
            .post("/api/v1/auth/register")
            .send({
                first: "test",
                lastName: "user",
                phoneNumber: "0778986544",
                email: "first@user.com",
                role: Role.owner,
            })
            .expect("Content-Type", /json/)
            .expect(500);
    });
});
