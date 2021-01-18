const { Model } = require("objection");
const tableNames = require("../../../constants/tableNames");
const db = require("../../../db");
const schema = require("./order.schema.json");

class Order extends Model {
    static get tableName() {
        return tableNames.order;
    }

    static get jsonSchema() {
        return schema;
    }

    static get relationMappings() {
        const Company = require("../company.model");
        const OrderItem = require("./orderItem/orderItem.model");
        const Item = require("../menu/category/item/item.model");

        return {
            items: {
                relation: Model.HasManyRelation,
                modelClass: OrderItem,
                join: {
                    from: `${tableNames.order}.id`,
                    to: `${tableNames.orderItem}.order_id`,
                },
            },

            // itemss: {
            //     relation: Model.ManyToManyRelation,
            //     modelClass: OrderItem,
            //     join: {
            //         from: `${tableNames.order}.id`,
            //         through: {
            //             modelClass: Item,
            //             from: `${tableNames.orderItem}.order_id`,
            //             to: `${tableNames.orderItem}.item_id`,
            //         },
            //         to: `${tableNames.item}.id`,
            //     },
            // },
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: `${tableNames.order}.company_id`,
                    to: `${tableNames.company}.id`,
                },
            },
        };
    }
}

Model.knex(db);

module.exports = Order;
