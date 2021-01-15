const express = require("express");

const { createSchema, updateSchema } = require("./menu.validator");
const { auth: Auth, isOwner } = require("../../../_middlewares/auth");
const Role = require("../../../utils/role");
const Category = require("./category/category.routes");

const menuService = require("./menu.service");
const { menu } = require("../../../constants/tableNames");

const router = express.Router({
    mergeParams: true,
});

// api/v1/company/company_id/menu/:menu_id/category
router.use("/:menu_id/category", Category);

router.post("/", Auth([Role.owner]), isOwner(), createSchema, create);
router.get("/", getAllCompanyMenus);
router.get("/:id", getMenuById);
router.patch("/:id", Auth([Role.owner]), isOwner(), updateSchema, update);
router.delete("/:id", Auth([Role.owner]), isOwner(), _deleteMenu);

module.exports = router;

function create(req, res, next) {
    req.body.company_id = parseInt(req.params.company_id);
    menuService
        .createMenu(req.body)
        .then((menu) => res.json(menu))
        .catch(next);
}

function getAllCompanyMenus(req, res, next) {
    const company_id = parseInt(req.params.company_id);

    menuService
        .getAllCompanyMenus({ company_id })
        .then((menus) => {
            return menus
                ? menus.length == 1
                    ? res.json(menus[0])
                    : res.json(menus)
                : res.sendStatus(404);
        })
        .catch(next);
}

function getMenuById(req, res, next) {
    const id = parseInt(req.params.id);

    menuService
        .getMenuById(id)
        .then((menu) => (menu ? res.json(menu) : res.sendStatus(404)))
        .catch(next);
}

function update(req, res, next) {
    // only owner can update their company menu
    req.body.company_id = parseInt(req.params.company_id);
    menuService
        .updateMenu(req.params.id, req.body)
        .then((menu) => (menu ? res.json(menu) : res.sendStatus(404)))
        .catch(next);
}

function _deleteMenu(req, res, next) {
    // only owner delete can delete their company menu
    const id = parseInt(req.params.id);
    const company_id = parseInt(req.params.company_id);
    menuService
        ._delete({
            id,
            company_id,
        })
        .then(() => {
            res.json({ id });
        })
        .catch(next);
}
