const express = require("express");
const router = express.Router();
const {
    signinSchema,
    signupSchema,
    signupSchemaStaff,
    updateSchema,
    verifyEmailSchema,
} = require("./auth.validators");
const authService = require("./auth.service");
const { auth: Auth } = require("../../_middlewares/auth");
const Role = require("../../utils/role");

router.post("/login", signinSchema, login);
router.post("/register-customer", signupSchema, registerCustomer);
router.post("/register-owner", signupSchema, register);
router.post("/verify-email", verifyEmailSchema, verifyEmail);
router.get("/", Auth(Role.admin), getAll);
router.get("/:id", Auth(), getById);
router.post("/create-staff", Auth(Role.owner), signupSchemaStaff, createStaff);
router.put("/:id", Auth(), updateSchema, update);
router.delete("/:id", Auth(), _delete);

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
    req.body.role = Role.owner;
    authService
        .register(req.body, req.get("origin"))
        .then(({ user, token }) => {
            return res.json({
                user,
                token,
                message:
                    "Registration successfull, please check your email for verification instructions",
            });
        })
        .catch(next);
}

function registerCustomer(req, res, next) {
    req.body.role = Role.customer;
    authService
        .register(req.body, req.get("origin"))
        .then(({ user, token }) => {
            return res.json({
                user,
                token,
                message:
                    "Registration successfull, please check your email for verification instructions",
            });
        })
        .catch(next);
}

function verifyEmail(req, res, next) {
    authService
        .verifyEmail(req.body)
        .then(() => res.json({ message: "Verification successfull" }))
        .catch(next);
}

function getAll(req, res, next) {
    authService
        .getAll()
        .then((accounts) => res.json(accounts))
        .catch(next);
}

function getById(req, res, next) {
    // users can get their own account and admin can get any account
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.admin) {
        return res.status(401).json({ message: "Unathorized" });
    }

    authService
        .getById(req.params.id)
        .then((account) => (account ? res.json(account) : res.sendStatus(404)))
        .catch(next);
}

function createStaff(req, res, next) {
    const {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        company_id,
    } = req.body;

    const payload = {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        role: Role.staff,
    };

    authService
        .createStaff(payload, company_id)
        .then((account) => res.json(account))
        .catch(next);
}

function update(req, res, next) {
    // users can update their accounts and admin can update any account
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.admin) {
        return res.status(401).json({ message: "Unathorized" });
    }

    authService
        .update(req.params.id, req.body)
        .then((account) => res.json(account))
        .catch(next);
}

function _delete(req, res, next) {
    // users can delete their accounts and admin can update any account
    if (Number(req.params.id) !== req.user.id && req.user.role !== Role.admin) {
        return res.status(401).json({ message: "Unathorized" });
    }

    authService
        .delete(req.param.id)
        .then(() =>
            res.json({
                message: "Account deleted successfully",
                id: req.params.id,
            })
        )
        .catch(next);
}
