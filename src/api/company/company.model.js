const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");
const userSchema = require("./company.schema.json");

class Company extends Model {
    static get tableName() {
        return tableNames.company;
    }

    static get jsonSchema() {
        return userSchema;
    }

    static get relationMappings() {
        // Importing models here is a one way to avoid require loops.
        const User = require("../user/user.model");
        const Account = require("./accounts/accounts.model");
        return {
            owner: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: `${tableNames.company}owner_.id`,
                    to: `${tableNames.user}.id`,
                },
            },
            accounts: {
                relation: Model.HasManyRelation,
                modelClass: Account,
                join: {
                    from: `${tableNames.company}.id`,
                    to: `${tableNames.accounts}company_.id`,
                },
            },
        };
    }
}

module.exports = Company;
