const express = require("express");
const router = express.Router();
const {
    signinSchema,
    signupSchema,
    updateSchema,
    verifyEmailSchema,
} = require("./auth.validators");
const authService = require("./auth.service");
const { auth } = require("../../_middlewares/auth");

router.post("/login", signinSchema, login);
router.post("/register", signupSchema, register);
router.post("/verify-email", verifyEmailSchema, verifyEmail);
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", signupSchema, create);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);

module.exports = router;

function login(req, res, next) {
    const { email, password } = req.body;
    authService
        .login({ email, password })
        .then(({ user, token }) => {
            res.json({ user, token });
        })
        .catch(next);
}

function register(req, res, next) {
    authService
        .register(req.body, req.get("origin"))
        .then(({ user, token }) => {
            res.json({
                user,
                token,
                message:
                    "Registration successfull, please check your email for verification instructions",
            });
        })
        .catch(next);
}
