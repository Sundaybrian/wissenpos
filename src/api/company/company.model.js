const { Model } = require('objection');
const tableNames = require('../../constants/tableNames');
const schema = require('./company.schema.json');

class Company extends Model {
  static get tableName() {
    return tableNames.company;
  }

  static get jsonSchema() {
    return schema;
  }

  static get relationMappings() {
    // Importing models here is a one way to avoid require loops.
    const User = require('../user/user.model');
    const Account = require('./accounts/accounts.model');
    const Menu = require('./menu/menu.model');

    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${tableNames.company}.owner_id`,
          to: `${tableNames.user}.id`,
        },
      },
      accounts: {
        relation: Model.HasManyRelation,
        modelClass: Account,
        join: {
          from: `${tableNames.company}.id`,
          to: `${tableNames.accounts}.company_id`,
        },
      },
      menus: {
        relation: Model.HasManyRelation,
        modelClass: Menu,
        join: {
          from: `${tableNames.company}.id`,
          to: `${tableNames.menu}.company_id`,
        },
      },
    };
  }
}

module.exports = Company;
