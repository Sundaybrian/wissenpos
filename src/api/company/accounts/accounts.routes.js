const Account = require("./accounts.model");
const Company = require("../company.model");
const Role = require("../../../utils/role");
const { auth: Auth, isOwner } = require("../../../_middlewares/auth");

const router = require("express").Router({
    mergeParams: true,
});

router.get("/", Auth([Role.admin, Role.owner]), isOwner(), getAccounts);

module.exports = router;

async function getAccounts(req, res, next) {
    try {
        // if (!company && req.user.role !== Role.admin) {
        //     return res.status(401).json({ message: "Unauthorized" });
        // }

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
