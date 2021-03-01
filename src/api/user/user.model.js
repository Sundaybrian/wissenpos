const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");
const db = require("../../db");
const schema = require("./user.schema.json");

class User extends Model {
    static get tableName() {
        return tableNames.user;
    }

    static get jsonSchema() {
        return schema;
    }

    static modifiers = {
        defaultSelects(query) {
            const { ref } = User;
            query.select(
                ref("id"),
                ref("firstName"),
                ref("role"),
                ref("lastName"),
                ref("email"),
                ref("phoneNumber"),
                ref("active"),
                ref("image_url"),
                ref("created_at"),
                ref("isVerified"),
                ref("updated_at"),
                ref("password"),
                ref("verificationToken")
            );
        },

        defaultSelectsWithoutPass(query) {
            const { ref } = User;
            query.select(
                ref("id"),
                ref("firstName"),
                ref("role"),
                ref("lastName"),
                ref("email"),
                ref("phoneNumber"),
                ref("active"),
                ref("image_url"),
                ref("created_at"),
                ref("isVerified"),
                ref("updated_at"),
                ref("verificationToken")
            );
        },
    };

    static get relationMappings() {
        const Company = require("../company/company.model");

        return {
            companies: {
                // HasManyRelation: Use this relation when the related model has the foreign key
                relation: Model.HasManyRelation,
                modelClass: Company,
                join: {
                    from: `${tableNames.user}.id`,
                    to: `${tableNames.company}.owner_id`,
                },
            },
        };
    }
}

Model.knex(db);

module.exports = User;
