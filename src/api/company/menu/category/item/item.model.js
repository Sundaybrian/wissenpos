const { Model } = require("objection");
const tableNames = require("../../../../../constants/tableNames");
const db = require("../../../../../db");

class Item extends Model {
    static get tableName() {
        return tableNames.item;
    }

    static get relationMappings() {
        const Category = require("../../category/category.model");

        return {
            category: {
                relation: Model.BelongsToOneRelation,
                modelClass: Category,
                join: {
                    from: `${tableNames.item}.category_id`,
                    to: `${tableNames.category}.id`,
                },
            },
        };
    }
}

Model.knex(db);

module.exports = Item;
