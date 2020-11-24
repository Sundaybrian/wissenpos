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
        const MenuCategory = require("./menu-category/menu-category.model");
        const Category = require("../category/category.model");

        return {
            company: {
                relation: Model.BelongsToOneRelation,
                modelClasss: Company,
                join: {
                    from: `${tableName.menu}.company_id`,
                    to: `${tableNames.company}.id`,
                },
            },
            categories: {
                relation: Model.ManyToManyRelation,
                modelClasss: Category,
                join: {
                    from: `${tableNames.menu}.id`,
                    through: {
                        modelClass: MenuCategory,
                        from: `${tableNames.menuCategory}.menu_id`,
                        to: `${tableNames.menuCategory}.category_id`,
                    },
                    to: `${tableNames.category}.id`,
                },
            },
        };
    }
}

Model.knex(db);

module.exports = Menu;
