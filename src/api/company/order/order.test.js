const request = require("supertest");
const app = require("../../../app");

// let variables
let token1;
let user1;

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

// fetch user orders
describe("GET /api/v1/company/:company_id/order/my-orders", () => {
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

    it("should fail to find orders if cart id is not present", async () => {
        const res = await request(app)
            .get("/api/v1/company/1/order/my-orders")
            .expect(500);

        expect(res.body.message).toContain(`Validation error`);
    });
    it("should return 404 for my orders", async () => {
        const res = await request(app)
            .get("/api/v1/company/1/order/my-orders")
            .expect(404);
    });

    it("should retun orders array and items", async () => {
        const res = await request(app)
            .get("/api/v1/company/1/order/my-orders")
            .send({
                cart_id: cart_id,
            })
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.orders).toBeGreaterThan(0);
    });
});

// fetch company order stats

// fetch user orders
describe("GET /api/v1/company/:company_id/order/orderStats", () => {
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
                user1 = res.body.user;
                done();
            });
    });

    it("should fail to find orders stats if company_id id is not present", async () => {
        const res = await request(app)
            .get("/api/v1/company/undefined/order/orderStats")
            .set("Authorization", `Bearer ${token1}`)
            .expect(500);
    });

    it("should return 404 for my order stats", async () => {
        const res = await request(app)
            .get("/api/v1/company/1000/order/orderStats")
            .set("Authorization", `Bearer ${token1}`)
            .expect(404);
    });

    it("should return order stats", async () => {
        const res = await request(app)
            .get("/api/v1/company/1/order/orderStats")
            .set("Authorization", `Bearer ${token1}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body).toHaveProperty("returns");
    });
});
