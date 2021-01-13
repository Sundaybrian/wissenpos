const Account = require("./accounts.model");
const Company = require("../company.model");
const Role = require("../../../utils/role");
const { auth: Auth } = require("../../../_middlewares/auth");

const router = require("express").Router({
    mergeParams: true,
});

router.get("/", Auth([Role.admin, Role.owner]), getAccounts);

module.exports = router;

async function getAccounts(req, res, next) {
    try {
        const company = await Company.query()
            .where({
                owner_id: req.user.id,
                id: req.params.company_id,
            })
            .first();

        if (!company && req.user.role !== Role.admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const accounts = await Account.query().where({
            company_id: req.params.company_id,
        });

        if (!accounts) {
            return res.status(404);
        }

        res.json(accounts);
    } catch (error) {
        next(error);
    }
}
