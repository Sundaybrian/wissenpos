const { Model } = require('objection');
const tableNames = require('../../../constants/tableNames');
const db = require('../../../db');
const schema = require('./order.schema.json');
const Cursor = require('../../../utils/cursorPagination');

class Order extends Cursor(Model) {
  static get tableName() {
    return tableNames.order;
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    const Company = require('../company.model');
    const OrderItem = require('./orderItem/orderItem.model');
    const User = require('../../user/user.model');

    return {
      items: {
        relation: Model.HasManyRelation,
        modelClass: OrderItem,
        join: {
          from: `${tableNames.order}.id`,
          to: `${tableNames.orderItem}.order_id`,
        },
      },
      customer: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: `${tableNames.order}.customer_id`,
          to: `${tableNames.user}.id`,
        },
      },
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
