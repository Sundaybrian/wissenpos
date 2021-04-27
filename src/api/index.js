const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "API - 👋🌎🌍🌏",
    });
});

router.use("/accounts", require("./auth/auth.routes"));
router.use("/company", require("./company/company.routes"));
router.use("/orders", require("./company/order/order.routes"));

module.exports = router;
