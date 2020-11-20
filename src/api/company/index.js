const express = require("express");
const { createSchema, updateSchema } = require("./company.validators");
const companyService = require("./auth.service");
const { auth } = require("../../_middlewares/auth");
const Role = require("../../utils/role");

const Account = require("./accounts/index");

const router = express.Router({
    mergeParams: true,
});

// api/v1/company/1/accounts
router.use("/:company_id/accounts", Account);

router.post("/", auth([Role.admin, Role.owner]), createSchema, create);
router.get("/", auth([Role.admin, Role.owner]), getAllCompanies);
router.get("/:id", auth([Role.admin, Role.owner]), getCompanyById);
router.put("/:id", auth([Role.owner]), updateSchema, update);
router.delete("/:id", auth([Role.admin, Role.owner]), _deleteCompany);

module.exports = router;

function create(req, res, next) {
    companyService
        .create(req.body)
        .then((company) => res.json(company))
        .catch(next);
}

function getAllCompanies(req, res, next) {
    companyService
        .getAllCompanies()
        .then((companies) => res.json(scopedItems(req.user, companies)))
        .catch(next);
}

function getCompanyById(req, res, next) {
    // owner can get his company and the admin can get any company
    companyService
        .getCompanyById(req.params.id)
        .then((company) => {
            if (
                company.owner_id !== req.user.id &&
                req.user.role !== Role.admin
            ) {
                return res.status(401).json({ message: "Unathorized" });
            }

            res.json(company);
        })
        .catch(next);
}

function update(req, res, next) {
    // only owner can update their company
    companyService
        .updateCompany({ id: req.params.id, owner_id: req.user.id }, req.body)
        .then((company) => res.json(company))
        .catch(next);
}

function _deleteCompany(req, res, next) {
    // only owner delete can delete their company
    companyService
        ._delete({ id: req.params.id, owner: req.user.id })
        .then(() => {
            res.json(req.params.id);
        })
        .catch(next);
}
