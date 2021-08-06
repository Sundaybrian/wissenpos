const { Model } = require('objection');
const tableNames = require('../../../../constants/tableNames');
const db = require('../../../../db');

class OrderItem extends Model {
  static get tableName() {
    return tableNames.orderItem;
  }

  static modifiers = {
    defaultSelects(query) {
      query
        .alias('oi')
        .select(
          'oi.id',
          'oi.item_id',
          'oi.quantity',
          'oi.created_at',
          'oi.updated_at',
          'item.id as item_id',
          'item.name',
          'item.image_url',
          'item.price',
        )
        .join(`${tableNames.item}`, 'oi.item_id', `${tableNames.item}.id`);
    },
  };

  static get relationMappings() {
    const Order = require('../order.model');

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
