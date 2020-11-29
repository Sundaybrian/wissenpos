const express = require("express");
const { createSchema, updateSchema } = require("./item.validators");
const { auth: Auth } = require("../../../../_middlewares/auth");
const Role = require("../../../../utils/role");

const router = express.Router({
    mergeParams: true,
});

router.post("/", Auth([Role.owner]), createSchema, create);
