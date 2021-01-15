const express = require("express");

const { createSchema, updateSchema } = require("./category.validators");
const { auth: Auth, isOwner } = require("../../../../_middlewares/auth");
const Role = require("../../../../utils/role");
const Item = require("./item/item.routes");

const categoryService = require("./category.service");
const error = require("../../../../utils/error");

const router = express.Router({
    mergeParams: true,
});

// api/v1/company/:company_id/menu/:menu_id/category/:category_id/item
router.use("/:category_id/item", Item);

//api/v1/company/:company_id/:menu_id/category/
router.post("/", Auth([Role.owner]), isOwner(), createSchema, create);
router.get("/", getAllCompanyCategorys);
router.get("/:id", getCategoryById);
router.patch("/:id", Auth([Role.owner]), isOwner(), updateSchema, update);
router.delete("/:id", Auth([Role.owner]), isOwner(), _deleteCategory);

module.exports = router;

function create(req, res, next) {
    categoryService
        .createCategory(req.body)
        .then((category) => res.json(category))
        .catch(next);
}

function getAllCompanyCategorys(req, res, next) {
    const menu_id = parseInt(req.params.menu_id);

    categoryService
        .getAllCompanyCategorys({ menu_id })
        .then((categories) =>
            categories ? res.json(categories) : res.sendStatus(404)
        )
        .catch(next);
}

function getCategoryById(req, res, next) {
    const id = parseInt(req.params.id);
    categoryService
        .getCategoryById(id)
        .then((category) =>
            category ? res.json(category) : res.sendStatus(404)
        )
        .catch(next);
}

function update(req, res, next) {
    // only owner can update their company category
    const payload = req.body;
    const id = parseInt(req.params.id);
    payload.menu_id = parseInt(req.params.menu_id);

    categoryService
        .updateCategory(id, payload)
        .then((category) =>
            category ? res.json(category) : res.sendStatus(404)
        )
        .catch(next);
}

function _deleteCategory(req, res, next) {
    // only owner delete can delete their company category
    const payload = {
        id: parseInt(req.params.id),
        menu_id: parseInt(req.params.menu_id),
    };

    categoryService
        ._delete(payload)
        .then(() => {
            res.json({ id: payload.id });
        })
        .catch(next);
}
