const request = require("supertest");
const app = require("../../app");
const User = require("../user/user.model");
const Company = require("./company.model");
const Role = require("../../utils/role");

// variables

describe("POST /api/v1/company/", () => {
    let token;
    beforeEach(function (done) {
        request(app)
            .post("/api/v1/accounts/login")
            .send({
                email: "sunday@owner.com",
                password: "12345678yh",
            })
            .end(function (err, res) {
                if (err) throw err;
                token = res.body.token;
                done();
            });
    });

    it("should fail to create a company for an unauthorized user", async () => {
        await request(app)
            .post("/api/v1/company")
            .send({
                name: "x-company",
                email: "xcompany@gmail.com",
            })
            .expect("Content-Type", /json/)
            .expect(403);
    });

    it("should fail to create a company missing description", async () => {
        const res = await request(app)
            .post("/api/v1/company")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "x-company",
                email: "xcompany@gmail.com",
            })
            .expect("Content-Type", /json/)
            .expect(500);
    });

    it("should create a company", async () => {
        const res = await request(app)
            .post("/api/v1/company")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "x-company",
                email: "xcompany@gmail.com",
                description: "x company the greatest",
            })
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.name).toBe("x-company");
    });
});
