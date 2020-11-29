const { Model } = require("objection");
const tableNames = require("../../../../constants/tableNames");
const db = require("../../../../db");

class Item extends Model {
    static get tableName() {
        return tableNames.item;
    }

    static get relationMappings() {
        const Company = require("../../company.model");

        return {
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: `${tableNames.item}.company_id`,
                    to: `${tableNames.company}.id`,
                },
            },
        };
    }
}

Model.knex(db);

module.exports = Item;
