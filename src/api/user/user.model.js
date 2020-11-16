const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");
// const userSchema = require("./users.schema.json");

class User extends Model {
    static get tableName() {
        return tableNames.user;
    }

    //   static get jsonSchema() {
    //     return userSchema;
    //   }
}

module.exports = User;
