const { Model } = require("objection");
const db = require("../../../db");
const schema = require("./menu.schema.json");
const tableNames = require("../../../constants/tableNames");

class Menu extends Model {
    static get tableName() {
        return tableNames.menu;
    }

    static get jsonSchema() {
        return schema;
    }

    static get relationMappings() {
        // Importing models here is a one way to avoid require loops.
        const Company = require("../company.model");

        return {
            company: {
                relation: Model.BelongsToOneRelation,
                modelClasss: Company,
                join: {
                    from: `${tableName.menu}.company_id`,
                    to: `${tableNames.company}.id`,
                },
            },
        };
    }
}

Model.knex(db);

module.exports = Menu;
