const Account = require("./accounts.model");
const Role = require("../../../utils/role");
const { auth } = require("../../../_middlewares/auth");

const router = require("express").Router({
    mergeParams: true,
});

router.get("/", auth([Role.admin, Role.owner]), getAccounts);

module.exports = router;

async function getAccounts(req, res, next) {
    try {
        const { owner_id } = req.body;

        if (owner_id !== req.user.id && req.user.role !== Role.admin) {
            return res.status(401).json({ message: "Unathorized" });
        }

        const accounts = await Account.query().where({
            company_id: req.params.company_id,
            owner_id,
        });

        if (!accounts) {
            res.status(404);
        }

        res.json(accounts);
    } catch (error) {
        next(error);
    }
}
