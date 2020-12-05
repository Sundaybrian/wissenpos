const { Model } = require("objection");
const tableNames = require("../../../../constants/tableNames");
const db = require("../../../../db");

class OrderItem extends Model {
    static get tableName() {
        return tableNames.orderItem;
    }

    static get relationMappings() {
        const Order = require("./Order/Order.model");

        return {
            order: {
                relation: Model.BelongsToOneRelation,
                modelClass: Order,
                join: {
                    from: `${tableNames.orderItem}.order_id`,
                    to: `${tableNames.Order}.id`,
                },
            },
        };
    }
}

Model.knex(db);

module.exports = OrderItem;
