const tableNames = require("../../src/constants/tableNames");

const { references } = require("../../src/utils/tableUtils");

/**
 * @param {import('knex')} knex
 */
exports.up = async function (knex) {
    await knex.schema.table(tableNames.item, (table) => {
        references(table, tableNames.company, null, false);
    });
};

/**
 * @param {import('knex')} knex
 */
exports.down = async function (knex) {
    await knex.schema.table(tableNames.item, (table) => {
        table.dropColumn("company_id");
    });
};
