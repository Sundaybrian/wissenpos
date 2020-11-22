const { Model } = require("objection");
const tableNames = require("../../constants/tableNames");
const db = require("../../db");

class User extends Model {
    static get tableName() {
        return tableNames.user;
    }
}

Model.knex(db);

module.exports = User;
