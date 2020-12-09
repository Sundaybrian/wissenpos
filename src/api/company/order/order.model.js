const { Model } = require("objection");
const tableNames = require("../../../constants/tableNames");
const db = require("../../../db");

class Order extends Model {
    static get tableName() {
        return tableNames.order;
    }

    static get relationMappings() {
        const Company = require("../company.model");
        const User = require("../../user/user.model");
        const OrderItem = require("./orderItem/orderItem.model");

        return {
            items: {
                relation: Model.HasManyRelation,
                modelClass: OrderItem,
                join: {
                    from: `${tableNames.order}.id`,
                    to: `${tableNames.orderItem}.order_id`,
                },
            },

            customerOrders: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: `${tableNames.order}.customer_id`,
                    to: `${tableNames.user}.id`,
                },
            },
            companyOrders: {
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
