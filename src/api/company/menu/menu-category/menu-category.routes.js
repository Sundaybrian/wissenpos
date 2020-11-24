const express = require("express");

const MenuCategory = require("./menu-category.model");

const router = express.Router({ mergeParams: true });

// router.get("/", async (req, res, next) => {
//     try {
//         const items = await MenuCategory.query().where("deleted_at", null);
//         res.json(items);
//     } catch (error) {
//         next(error);
//     }
// });

router.post("/", async (req, res, next) => {
    try {
        req.body.menu_id = Number(req.params.menu_id);
        req.body.company_id = Number(req.params.company_id);

        const item = await MenuCategory.query().insert(req.body);
        res.json(item);
    } catch (error) {
        next(error);
    }
});

// router.patch("/:id", async (req, res, next) => {
//     try {
//         const item = await MenuCategory.query().patchAndFetchById(
//             req.params.id,
//             req.body
//         );
//         res.json(item);
//     } catch (error) {
//         next(error);
//     }
// });

module.exports = router;
