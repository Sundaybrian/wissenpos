const tableNames = require('../../src/constants/tableNames');

const { addDefaultColumns, addDefaultColumnsUser } = require('../../src/utils/tableUtils');

/**
 * @param {import('knex')} knex
 */
exports.up = async function (knex) {
  await knex.schema.table(tableNames.accounts, table => {
    table.renameColumn('staff_id_id', 'staff_id');
  });
};

/**
 * @param {import('knex')} knex
 */
exports.down = async function (knex) {
  await knex.schema.table(tableNames.accounts, table => {
    table.renameColumn('staff_id', 'staff_id_id');
  });
};
