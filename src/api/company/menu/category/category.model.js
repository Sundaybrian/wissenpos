const { Model } = require("objection");
const db = require("../../../../db");
const schema = require("./category.schema.json");
const tableNames = require("../../../../constants/tableNames");

class Category extends Model {
    static get tableName() {
        return tableNames.category;
    }

    static get jsonSchema() {
        return schema;
    }

    static get relationMappings() {
        // Importing models here is a one way to avoid require loops.
        const Menu = require("../menu.model");
        const Item = require("./item/item.model");

        return {
            menu: {
                relation: Model.BelongsToOneRelation,
                modelClass: Menu,
                join: {
                    from: `${tableNames.category}.menu_id`,
                    to: `${tableNames.menu}.id`,
                },
            },
            items: {
                relation: Model.HasManyRelation,
                modelClass: Item,
                join: {
                    from: `${tableNames.category}.id`,
                    to: `${tableNames.item}.category_id`,
                },
            },
        };
    }
}

Model.knex(db);

module.exports = Category;
