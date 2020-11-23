const request = require("supertest");
const app = require("../../app");
const User = require("../user/user.model");
const Role = require("../../utils/role");

describe("POST /api/v1/accounts/register", () => {
    it("should fail to create a user with missing fields", async () => {
        await request(app)
            .post("/api/v1/accounts/register")
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

    it("should fail to signup user with existing email", async () => {
        const res = await request(app)
            .post("/api/v1/accounts/register")
            .send({
                firstName: "test",
                lastName: "user",
                phoneNumber: "0778986544",
                email: "sunday@owner.com",
                password: "localtestuser",
                confirmPassword: "localtestuser",
                role: Role.owner,
            })
            .expect("Content-Type", /json/)
            .expect(500);
    });

    it("should signup a user ", async () => {
        const res = await request(app)
            .post("/api/v1/accounts/register")
            .send({
                firstName: "goof",
                lastName: "doctor",
                phoneNumber: "0778976544",
                password: "localtestuser",
                confirmPassword: "localtestuser",
                email: "goof@owner.com",
                role: Role.owner,
            })
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.message).toEqual(
            "Registration successfull, please check your email for verification instructions"
        );
        expect(res.body.user.email).toEqual("goof@owner.com");
    });
});
