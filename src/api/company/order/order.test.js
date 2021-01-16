const request = require("supertest");
const app = require("../../../app");

describe("POST /api/v1/company/:company_id/order", () => {
    it("should fail to creat an order if cart_id is missing", async () => {
        const res = await request(app)
            .post("/api/v1/company/1/order")
            .send({
                product_id: "1",
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
                product_id: "1",
                quantity: 10,
                cart_id: "xtreeme",
            })
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.message).toContain(`has been added to the cart`);
    });
});
