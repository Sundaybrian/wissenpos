const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");
const db = require("../../db");

class User extends Model {
    static get tableName() {
        return tableNames.user;
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
                ref("verification_token")
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
                ref("verification_token")
            );
        },
    };
}

Model.knex(db);

module.exports = User;
