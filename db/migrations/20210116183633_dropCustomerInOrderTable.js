const tableNames = require("../../src/constants/tableNames");

const { references } = require("../../src/utils/tableUtils");

/**
 * @param {import('knex')} knex
 */
exports.up = async function (knex) {
    await knex.schema.table(tableNames.order, (table) => {
        table.dropColumn("customer_id_id");
        table.string("cart").unique().notNullable();
    });
};

/**
 * @param {import('knex')} knex
 */
exports.down = async function (knex) {
    await knex.schema.table(tableNames.order, (table) => {
        references(table, tableNames.user, "customer_id", true);
        table.dropColumn("cart_id");
    });
};
