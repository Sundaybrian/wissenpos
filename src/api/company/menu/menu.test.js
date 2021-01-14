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

describe("GET /api/v1/company/:company_id/menu", () => {
    it("Should return company menu", async () => {
        await request(app).get("/api/v1/company/1/menu").expect(200);
    });
});

describe("GET api/v1/company/:company_id/menu/:id", () => {
    it("should fail to find a menu", async () => {
        await request(app).get("/api/v1/company/1/menu/10").expect(404);
    });

    it("should find a menu", async () => {
        const res = await request(app)
            .get("/api/v1/company/1/menu/1")
            .expect(200);
        expect(res.body.name).toBe("super menu");
    });
});

describe("PATCH api/v1/company/:company_id/menu/:id", () => {
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

    it("should fail to update menu for another company", async () => {
        await request(app)
            .patch("/api/v1/company/2/menu/2")
            .set("Authorization", `Bearer ${token1}`)
            .expect(401);
    });

    it("should update menu", async () => {
        const res = await request(app)
            .patch("/api/v1/company/1/menu/1")
            .set("Authorization", `Bearer ${token1}`)
            .send({
                name: "super menu 1",
            })
            .expect(200);
        expect(res.body.name).toBe("super menu 1");

        expect(res.body.id).toBe(1);
    });
});

describe("DELETE api/v1/company/:company_id/menu/:id", () => {
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

    it("should fail to delete another comapanys menu", async () => {
        await request(app)
            .delete("/api/v1/company/2/menu/2")
            .set("Authorization", `Bearer ${token1}`)
            .expect(401);
    });

    it("should delete menu", async () => {
        const res = await request(app)
            .delete("/api/v1/company/1/menu/1")
            .set("Authorization", `Bearer ${token1}`)
            .expect(200);
        expect(res.body.id).toBe(1);
    });
});
