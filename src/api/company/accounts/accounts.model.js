const { Model } = require("objection");
const tableNames = require("../../../constants/tableNames");
const schema = require("./accounts.schema.json");

class Account extends Model {
    static get tableName() {
        return tableNames.accounts;
    }

    static get jsonSchema() {
        return schema;
    }

    static modifiers = {
        defaultSelects(query) {
            const { ref } = Account;
            query.select(
                ref("id"),
                ref("company_id"),
                ref("staff_id"),
                ref("created_at"),
                ref("updated_at")
            );
        },
    };

    static get relationMappings() {
        const Company = require("../company.model");
        const User = require("../../user/user.model");

        return {
            company: {
                // HasManyRelation: Use this relation when the related model has the foreign key
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: `${tableNames.accounts}.company_id`,
                    to: `${tableNames.company}.id`,
                },
            },
            user: {
                // HasManyRelation: Use this relation when the related model has the foreign key
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: `${tableNames.accounts}.staff_id`,
                    to: `${tableNames.user}.id`,
                },
            },
        };
    }
}

module.exports = Account;
