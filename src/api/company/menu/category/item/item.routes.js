const express = require("express");
const { createSchema, updateSchema } = require("./item.validators");
const { auth: Auth } = require("../../../../../_middlewares/auth");
const Role = require("../../../../../utils/role");
const itemService = require("./item.service");

const router = express.Router({
    mergeParams: true,
});

router.post("/", Auth([Role.owner]), createSchema, create);
router.get("/:id", Auth(), getById);
router.patch("/:id", Auth([Role.owner]), updateSchema, updateItem);
router.delete("/:id", Auth([Role.owner]), deleteItem);

module.exports = router;

function create(req, res, next) {
    itemService
        .createItem(req.body)
        .then((item) => res.status(201).json(item))
        .catch(next);
}

function getById(req, res, next) {
    itemService
        .getItemById(req.params.id)
        .then((item) => (item ? res.json(item) : res.sendStatus(404)))
        .catch(next);
}

function updateItem(req, res, next) {
    itemService
        .updateItem(req.params.id, req.body)
        .then((item) => (item ? res.json(item) : res.sendStatus(404)))
        .catch(next);
}

function deleteItem(req, res, next) {
    itemService
        .deleteItem({ id: req.params.id })
        .then(() =>
            res.json({
                message: "Item deleted successfully",
                id: req.params.id,
            })
        )
        .catch(next);
}
