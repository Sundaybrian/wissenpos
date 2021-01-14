const express = require("express");

const { createSchema, updateSchema } = require("./menu.validator");
const Company = require("../company.model");
const { auth: Auth, isOwner } = require("../../../_middlewares/auth");
const Role = require("../../../utils/role");
const Category = require("./category/category.routes");

const menuService = require("./menu.service");
const error = require("../../../utils/error");

const router = express.Router({
    mergeParams: true,
});

// api/v1/company/company_id/menu_id/category
router.use("/:menu_id/category", Category);

router.post("/", Auth([Role.owner]), isOwner(), createSchema, create);
router.get("/", getAllCompanyMenus);
router.get("/:id", getMenuById);
router.patch("/:id", Auth([Role.owner]), updateSchema, update);
router.delete("/:id", Auth([Role.owner]), _deleteMenu);

module.exports = router;

function create(req, res, next) {
    req.body.company_id = parseInt(req.params.company_id);
    menuService
        .createMenu(req.body)
        .then((menu) => res.json(menu))
        .catch(next);
}

function getAllCompanyMenus(req, res, next) {
    const { company_id } = req.params;

    menuService
        .getAllCompanyMenus({ id: company_id })
        .then((menus) => (menus ? res.json(menus) : res.sendStatus(404)))
        .catch(next);
}

function getMenuById(req, res, next) {
    menuService
        .getMenuById(req.params.id)
        .then((menu) => (menu ? res.json(menu) : res.sendStatus(404)))
        .catch(next);
}

function update(req, res, next) {
    // only owner can update their company menu

    Company.query()
        .where({ owner: req.user.id })
        .first()
        .then((company) => {
            if (!company) {
                res.status(401);
                error("Unathorized");
            }

            return menuService.updateMenu(req.params.id, req.body);
        })
        .then((menu) => (menu ? res.json(menu) : res.sendStatus(404)))
        .catch(next);
}

function _deleteMenu(req, res, next) {
    // only owner delete can delete their company menu

    Company.query()
        .where({ owner: req.user.id })
        .first()
        .then((company) => {
            if (!company) {
                res.status(401);
                error("Unathorized");
            }

            return menuService._delete({
                id: req.params.id,
                company_id: req.params.company_id,
            });
        })
        .then(() => {
            res.json({ id: req.params.id });
        })
        .catch(next);
}
