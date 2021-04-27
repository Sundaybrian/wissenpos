const tableNames = require("../../src/constants/tableNames");

const { references } = require("../../src/utils/tableUtils");

/**
 * @param {import('knex')} knex
 */
exports.up = async function (knex) {
    await knex.schema.table(tableNames.order, (table) => {
        // true for nullable
        references(table, tableNames.user, "customer", true);
    });
};

/**
 * @param {import('knex')} knex
 */
exports.down = async function (knex) {
    await knex.schema.table(tableNames.order, (table) => {
        table.dropColumn("customer_id");
    });
};
