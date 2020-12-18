const express = require("express");

const { createSchema, updateSchema } = require("./category.validators");
const { auth: Auth } = require("../../../../_middlewares/auth");
const Role = require("../../../../utils/role");
const Company = require("../../company.model");

const Item = require("./item/item.routes");

const categoryService = require("./category.service");
const error = require("../../../../utils/error");

const router = express.Router({
    mergeParams: true,
});

// api/v1/company_id/menu_id/category_id/item
router.use("/:category_id/item", Item);

router.post("/", Auth([Role.owner]), createSchema, create);
router.get("/", getAllCompanyCategorys);
router.get("/:id", getCategoryById);
router.patch("/:id", Auth([Role.owner]), updateSchema, update);
router.delete("/:id", Auth([Role.owner]), _deleteCategory);

module.exports = router;

function create(req, res, next) {
    // check if owner of company

    const { owner_id } = req.body;
    const payload = { ...req.body };

    delete payload.owner_id;

    if(!(await isOwner(req.user.id, req.params.company_id))){

    }

    // only owners of this company can make the category
    if (Number(req.user.id) !== owner_id) {
        error("Unathorized");
    }

    categoryService
        .createcategory(payload)
        .then((category) => res.json(category))
        .catch(next);
}

function getAllCompanyCategorys(req, res, next) {
    const { company_id } = req.params;

    categoryService
        .getAllCompanyCategorys({ company_id })
        .then((categories) =>
            categories ? res.json(categories) : res.sendStatus(404)
        )
        .catch(next);
}

function getCategoryById(req, res, next) {
    categoryService
        .getCategoryById(req.params.id)
        .then((category) =>
            category ? res.json(category) : res.sendStatus(404)
        )
        .catch(next);
}

function update(req, res, next) {
    // only owner can update their company category
    const { owner_id } = req.body;
    const payload = { ...req.body };
    delete payload.owner_id;

    if (Number(req.user.id) !== owner_id) {
        error("Unathorized");
    }

    categoryService
        .updateCategory(req.params.id, payload)
        .then((category) =>
            category ? res.json(category) : res.sendStatus(404)
        )
        .catch(next);
}

function _deleteCategory(req, res, next) {
    // only owner delete can delete their company category
    const { owner_id } = req.body;

    if (Number(req.user.id) !== owner_id) {
        error("Unathorized");
    }

    categoryService
        ._delete({ id: req.params.id, company_id: req.params.company_id })
        .then(() => {
            res.json(req.params.id);
        })
        .catch(next);
}

// =========================================
async function isOwner(owner_id, company_id) {
    const bool = await Company.query()
        .where({ owner_id, id: company_id })
        .first();

    return bool;
}
