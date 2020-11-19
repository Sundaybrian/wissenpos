const express = require("express");
const router = express.Router();
const { createSchema, updateSchema } = require("./company.validators");
const companyService = require("./auth.service");
const { auth } = require("../../_middlewares/auth");
const Role = require("../../utils/role");

router.post("/", auth([Role.admin, Role.owner]), createSchema, create);
router.get("/", auth([Role.admin, Role.owner]), getAllCompanies);
router.get("/:id", auth([Role.admin, Role.owner]), getCompanyById);
router.put("/:id", auth([Role.owner]), updateSchema, updateCompany);
router.delete("/:id", auth([Role.admin, Role.owner]), _deleteCompany);

module.exports = router;
