const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "API - 👋🌎🌍🌏",
    });
});

router.use("/auth", require("../api/auth"));
router.use("/company", require("../api/company"));

module.exports = router;
