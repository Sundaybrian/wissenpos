const { Model } = require("objection");
const db = require("../../../../db");
const tableNames = require("../../../../constants/tableNames");

class MenuCategory extends Model {
    static get tableName() {
        return tableNames.menuCategory;
    }
}

Model.knex(db);

module.exports = MenuCategory;
