const request = require("supertest");
const app = require("../../../../app");

let token1;

describe("POST /api/v1/company/:company_id/menu/:menu_id/category/", () => {
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

    it("should fail to creat a category for another company", async () => {
        await request(app)
            .post("/api/v1/company/2/menu/2/category")
            .set("Authorization", `Bearer ${token1}`)
            .send({
                name: "cat2",
                menu_id: 2,
            })
            .expect(401);
    });

    it("should create a category for your company", async () => {
        const res = await request(app)
            .post("/api/v1/company/1/menu/1/category")
            .set("Authorization", `Bearer ${token1}`)
            .send({
                name: "cat2",
                menu_id: 1,
            })
            .expect(200);

        expect(res.body.name).toBe("cat2");
    });
});
