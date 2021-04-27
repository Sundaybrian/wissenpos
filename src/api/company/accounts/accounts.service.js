const Account = require("../accounts/accounts.model");

class AccountService {
    constructor() {}

    static async addToCompany(params) {
        try {
            const Account = await Account.query().insert(params);

            return Account;
        } catch (error) {
            throw error;
        }
    }

    static async companyAccounts(company_id) {
        try {
            const companyAccounts = await Account.query()
                .alias("c")
                .where("c.id", company_id)
                .withGraphFetched("user(selectNameAndId)")
                .modifiers({
                    selectNameAndId(builder) {
                        builder
                            .select("company_id", "staff_id")
                            .innerJoin("user", "accounts.staff_id", "user.id");
                    },
                });

            return companyAccounts;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AccountService;
