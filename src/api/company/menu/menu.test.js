const request = require("supertest");
const app = require("../../../app");

// let variables
let token1, token2;

describe("POST /api/v1/company/:company_id/menu", () => {
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

    it("Should fail to create a menu with missing field", async () => {
        await request(app)
            .post("/api/v1/company/1/menu")
            .set("Authorization", `Bearer ${token1}`)
            .send({
                name: "event menu",
            })
            .expect(500);
    });

    it("Should create a menu", async () => {
        const res = await request(app)
            .post("/api/v1/company/1/menu")
            .set("Authorization", `Bearer ${token1}`)
            .send({
                name: "event menu",
                description: "menu for weddings",
            })
            .expect(200);

        expect(res.body.name).toBe("event menu");
    });

    it("Should fail to create a menu for another company", async () => {
        await request(app)
            .post("/api/v1/company/2/menu")
            .set("Authorization", `Bearer ${token1}`)
            .send({
                name: "event menu 1",
                description: "menu for weddings",
            })
            .expect(401);
    });
});
