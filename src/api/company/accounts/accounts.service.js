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

    // more coming soon
}

module.exports = AccountService;
