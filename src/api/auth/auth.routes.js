const express = require("express");
const router = express.Router();
const {
    signinSchema,
    signupSchema,
    updateSchema,
    verifyEmailSchema,
} = require("./auth.validators");
const authService = require("./auth.service");
const { auth: Auth } = require("../../_middlewares/auth");
const Role = require("../../utils/role");

/**
 * @api {post} /accounts/login
 * @apiSampleRequest https://wissenspos.herokuapp.com/api/v1/accounts/login
 * @apiDescription endpoint to login a user
 * @apiName PostAccounts
 * @apiGroup Accounts
 *
 * @apiParam {String} email a user unique Email.
 * @apiParam {string{8...}} password a user password
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "password": "12345678yh",
 *        "email": "sunday@owner.com",
 *     }
 *
 * @apiSuccess {Object} user Object with user details an
 * @apiSuccess {Number} user.id id of the user
 * @apiSuccess {String} user.firstName firstName
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 *
 *       {
 *       "user": {
 *           "id": 5,
 *           "firstName": "sunday",
 *           "lastName": "owner",
 *           "email": "sunday@owner.com",
 *           "role": "owner",
 *           "isVerified": false
 *       },
 *         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZmlyc3ROYW1lIjoic3VuZGF5IiwibGFzdE5hbWUiOiJvd25lciIsImVtYWlsIjoic3VuZGF5QG93bmVyLmNvbSIsInBob25lTnVtYmVyIjoiMDcxMjM4MjM2NiIsInBhc3N3b3JkIjoiJDJiJDEwJEtUQXhXVFM0Rm5La1Zqa2N6NDRhSnVyOGdWQXNIcXhpRGI1R09kZWdVSnJsQmhXYmpuVktpIiwicm9sZSI6Im93bmVyIiwiYWN0aXZlIjp0cnVlLCJ2ZXJpZmllZCI6bnVsbCwiaXNWZXJpZmllZCI6ZmFsc2UsInZlcmlmaWNhdGlvblRva2VuIjpudWxsLCJpbWFnZV91cmwiOm51bGwsImNyZWF0ZWRfYXQiOiIyMDIwLTExLTI5VDA4OjMyOjUxLjYyOVoiLCJ1cGRhdGVkX2F0IjoiMjAyMC0xMS0yOVQwODozMjo1MS42MjlaIiwiZGVsZXRlZF9hdCI6bnVsbCwiaWF0IjoxNjA2NjM4ODk4LCJleHAiOjE2MDY2NDk2OTh9.bj8ocE-VUJ0MwDWHjpa45qVsK_yLAmQrZ5IFKTkL7DM"
 *
 *        }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *      HTTP/1.1 404 Not Found
 *      {
 *        "error": "UserNotFound"
 *      }
 *
 *
 */
router.post("/login", signinSchema, login);
router.post("/register", signupSchema, register);
router.post("/verify-email", verifyEmailSchema, verifyEmail);
router.get("/", Auth(Role.admin), getAll);
router.get("/:id", Auth(), getById);
router.post("/create-staff", Auth(Role.owner), signupSchema, create);
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

function create(req, res, next) {
    authService
        .create(req.body)
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
