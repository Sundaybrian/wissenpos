const request = require("supertest");
const app = require("../../app");
const User = require("../user/user.model");
const Company = require("./company.model");
const Role = require("../../utils/role");
const fs = require("fs");

// variables
let token1, token2, token3;

describe("POST /api/v1/company/", () => {
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
            .set("Authorization", `Bearer ${token1}`)
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
            .set("Authorization", `Bearer ${token1}`)
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

describe("PATCH /api/v1/company/:id", () => {
    beforeEach(function (done) {
        request(app)
            .post("/api/v1/accounts/login")
            .send({
                email: "diff@owner.com",
                password: "12345678yh",
            })
            .end(function (err, res) {
                if (err) throw err;
                token2 = res.body.token;
                done();
            });
    });

    it("should fail to update another persons company", async () => {
        const res = await request(app)
            .patch("/api/v1/company/1")
            .set("Authorization", `Bearer ${token2}`)
            .send({
                name: "x-company-faker",
            })
            .expect("Content-Type", /json/)
            .expect(500);

        expect(res.body.message).toBe("Unauthorized");
    });

    it("should update company name", async () => {
        const res = await request(app)
            .patch("/api/v1/company/1")
            .set("Authorization", `Bearer ${token1}`)
            .send({
                name: "x-company-real-owner",
            })
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.name).toBe("x-company-real-owner");
        expect(res.body.id).toBe(1);
    });

    it("should fail to update duplicate company name", async () => {
        const res = await request(app)
            .patch("/api/v1/company/1")
            .set("Authorization", `Bearer ${token1}`)
            .send({
                name: "x-company",
            })
            .expect("Content-Type", /json/)
            .expect(500);

        expect(res.body.message).toBe("Name x-company is already taken");
    });
});

describe("GET api/v1/company", () => {
    beforeEach(function (done) {
        request(app)
            .post("/api/v1/accounts/login")
            .send({
                email: "admin@admin.com",
                password: "12345678yh",
            })
            .end(function (err, res) {
                if (err) throw err;
                token3 = res.body.token;
                done();
            });
    });

    it("should not fetch companies for a non admin user", async () => {
        const res = await request(app)
            .get("/api/v1/company/")
            .set("Authorization", `Bearer ${token2}`)
            .expect("Content-Type", /json/)
            .expect(401);

        expect(res.body.message).toBe("Unauthorized");
    });

    it("should fetch companies for admin user", async () => {
        const res = await request(app)
            .get("/api/v1/company/")
            .set("Authorization", `Bearer ${token3}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe("PATCH /api/v1/company/:id", () => {
    beforeEach(function (done) {
        request(app)
            .post("/api/v1/accounts/login")
            .send({
                email: "diff@owner.com",
                password: "12345678yh",
            })
            .end(function (err, res) {
                if (err) throw err;
                token2 = res.body.token;
                done();
            });
    });

    it("should fail to update another persons company", async () => {
        const res = await request(app)
            .patch("/api/v1/company/1")
            .set("Authorization", `Bearer ${token2}`)
            .send({
                name: "x-company-faker",
            })
            .expect("Content-Type", /json/)
            .expect(500);

        expect(res.body.message).toBe("Unauthorized");
    });

    it("should update company name", async () => {
        const res = await request(app)
            .patch("/api/v1/company/1")
            .set("Authorization", `Bearer ${token1}`)
            .send({
                name: "x-company-real-owner",
            })
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.name).toBe("x-company-real-owner");
        expect(res.body.id).toBe(1);
    });

    it("should fail to update duplicate company name", async () => {
        const res = await request(app)
            .patch("/api/v1/company/1")
            .set("Authorization", `Bearer ${token1}`)
            .send({
                name: "x-company",
            })
            .expect("Content-Type", /json/)
            .expect(500);

        expect(res.body.message).toBe("Name x-company is already taken");
    });
});

describe("GET api/v1/company/:id", () => {
    it("owner should not fetch another company", async () => {
        const res = await request(app)
            .get("/api/v1/company/1")
            .set("Authorization", `Bearer ${token2}`)
            .expect("Content-Type", /json/)
            .expect(401);

        expect(res.body.message).toBe("Unauthorized");
    });

    it("should fetch owner company", async () => {
        const res = await request(app)
            .get("/api/v1/company/1")
            .set("Authorization", `Bearer ${token1}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.name).toBe("x-company-real-owner");
    });

    it("should return company to admin", async () => {
        const res = await request(app)
            .get("/api/v1/company/1")
            .set("Authorization", `Bearer ${token1}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.name).toBe("x-company-real-owner");
    });
});

describe("GET api/v1/company/mine", () => {
    it("should fetch my companies", async () => {
        const res = await request(app)
            .get("/api/v1/company/mine")
            .set("Authorization", `Bearer ${token1}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.length).toBeGreaterThan(0);
    });
});

describe("DELETE api/v1/company/:id", () => {
    it("owner should not delete anothers company", async () => {
        const res = await request(app)
            .delete("/api/v1/company/1")
            .set("Authorization", `Bearer ${token2}`)
            .expect("Content-Type", /json/)
            .expect(500);
        expect(res.body.message).toBe("Forbidden");
    });

    it("should delete company", async () => {
        const res = await request(app)
            .delete("/api/v1/company/1")
            .set("Authorization", `Bearer ${token1}`)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body.id).toBe(1);
    });
});
