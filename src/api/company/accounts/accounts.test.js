const request = require("supertest");
const app = require("../../../app");
const Account = require("./accounts.model");
const Role = require("../../../utils/role");

// variables
let token1, token2;

describe("GET /api/v1/company/:company_id/accounts", () => {
    beforeEach(function (done) {
        request(app)
            .post("/api/v1/accounts/login")
            .send({
                email: "sunday@owner.com",
                password: "12345678yh",
            })
            .end(function (err, res) {
                if (err) throw err;
                token1 = res.body.token;
                done();
            });
    });

    it("should fail to fetch company accounts for another company", async () => {
        const res = await request(app)
            .get("/api/v1/company/2/accounts")
            .set("Authorization", `Bearer ${token1}`)
            .expect(401);

        expect(res.body.message).toBe("Unauthorized");
    });

    it("should fetch company accounts", async () => {
        const res = await request(app)
            .get("/api/v1/company/1/accounts")
            .set("Authorization", `Bearer ${token1}`)
            .expect(200);
    });
});
