const express = require("express");

const { createSchema, updateSchema } = require("./menu.validator");
const { auth: Auth } = require("../../../_middlewares/auth");
const Role = require("../../../utils/role");

const menuService = require("./company.service");
const error = require("../../../utils/error");

const MenuCategory = require("./menu-category/menu-category.routes");

const router = express.Router({
    mergeParams: true,
});

// api/v1/company/company_id/menu_id/menu-category

router.use(":/menu_id/menu-category", MenuCategory);

router.post("/", Auth([Role.owner]), createSchema, create);
router.get("/", getAllCompanyMenus);
router.get("/:id", getMenuById);
router.put("/:id", Auth([Role.owner]), updateSchema, update);
router.delete("/:id", Auth([Role.owner]), _deleteMenu);

module.exports = router;

function create(req, res, next) {
    const { owner_id } = req.body;

    // only owners of this company can make the menu
    if (Number(req.user.id) !== owner_id) {
        error("Unathorized");
    }

    menuService
        .createMenu(req.body)
        .then((menu) => res.json(menu))
        .catch(next);
}

function getAllCompanyMenus(req, res, next) {
    const { company_id } = req.params;

    menuService
        .getAllCompanyMenus({ company_id })
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
    const { owner_id } = req.body;
    const payload = { ...req.body };
    delete payload.owner_id;

    if (Number(req.user.id) !== owner_id) {
        error("Unathorized");
    }

    menuService
        .updateMenu(req.params.id, payload)
        .then((menu) => (menu ? res.json(menu) : res.sendStatus(404)))
        .catch(next);
}

function _deleteMenu(req, res, next) {
    // only owner delete can delete their company menu
    const { owner_id } = req.body;

    if (Number(req.user.id) !== owner_id) {
        error("Unathorized");
    }

    menuService
        ._delete({ id: req.params.id, company_id: req.params.company_id })
        .then(() => {
            res.json(req.params.id);
        })
        .catch(next);
}
