const express = require("express");
const router = express.Router();
const {
    signinSchema,
    signupSchema,
    updateSchema,
} = require("./auth.validators");
const authService = require("./auth.service");

router.post("/login", signinSchema, login);
router.post("/register", signupSchema, register);
router.post("/verify-email", verifyEmailSchema, verifyEmail);
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", signupSchema, create);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);

module.exports = router;
