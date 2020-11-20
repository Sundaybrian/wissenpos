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
}

module.exports = Account;
