const { Model } = require("objection");
const tableNames = require("../../../../constants/tableNames");
const db = require("../../../../db");

class OrderItem extends Model {
    static get tableName() {
        return tableNames.orderItem;
    }

    static modifiers = {
        defaultSelects(query) {
            query
                .alias("oi")
                .select(
                    "oi.id",
                    "oi.item_id",
                    "oi.quantity",
                    "oi.created_at",
                    "oi.updated_at"
                )
                .join(
                    `${tableNames.item}`,
                    "oi.item_id",
                    `${tableNames.item}.id`
                );
        },
    };

    static get relationMappings() {
        const Order = require("../order.model");

        return {
            order: {
                relation: Model.BelongsToOneRelation,
                modelClass: Order,
                join: {
                    from: `${tableNames.orderItem}.order_id`,
                    to: `${tableNames.order}.id`,
                },
            },
        };
    }
}

Model.knex(db);

module.exports = OrderItem;
