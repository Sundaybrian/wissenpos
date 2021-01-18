const request = require("supertest");
const app = require("../../../app");

describe("POST /api/v1/company/:company_id/order", () => {
    it("should fail to creat an order if cart_id is missing", async () => {
        const res = await request(app)
            .post("/api/v1/company/1/order")
            .send({
                product_id: 1,
                quantity: 10,
            })
            .expect("Content-Type", /json/)
            .expect(500);

        expect(res.body.message).toContain("Validation error");
    });

    it("should create a cart and add item to it", async () => {
        const res = await request(app)
            .post("/api/v1/company/1/order")
            .send({
                product_id: 1,
                quantity: 10,
                cart_id: "xtreeme",
            })
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.message).toContain(`has been added to the cart`);
    });
});

describe("GET /api/v1/company/:company_id/order/:id", () => {
    let cart_id;

    beforeEach(function (done) {
        request(app)
            .post("/api/v1/company/1/order")
            .send({
                product_id: 1,
                quantity: 100,
                cart_id: "xtreeme1",
            })
            .end(function (err, res) {
                if (err) throw err;
                cart_id = "xtreem1";
                done();
            });
    });
    it("should fail to find a cart", async () => {
        const res = await request(app)
            .get("/api/v1/company/1/order/1")
            .expect(404);

        // expect(res.body.message).toContain("Validation error");
    });

    it("shoul retun cart and items", async () => {
        const res = await request(app)
            .get("/api/v1/company/1/order/xtreeme1")
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.cart_id).toBe(`xtreeme1`);
    });
});
