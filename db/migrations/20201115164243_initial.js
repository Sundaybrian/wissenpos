const tableNames = require("../../src/constants/tableNames");

const {
    addDefaultColumns,
    addDefaultColumnsUser,
} = require("../../src/utils/tableUtils");

/**
 * @param {import('knex')} knex
 */
exports.up = async function (knex) {
    // starting with tables without fk reference

    await Promise.all([
        knex.schema.createTable(tableNames.user, (table) => {
            addDefaultColumnsUser(table);
            addDefaultColumns(table);
        }),
        knex.schema.createTable(tableNames.address, (table) => {
            table.increments().notNullable();
            table.string("street_address", 50);
            table.string("zipcode", 15);
            table.string("city", 50).notNullable();
            table.string("country", 100).notNullable();
            table.double("latitude").notNullable();
            table.double("longitude").notNullable();
            addDefaultColumns(table);
        }),
    ]);
};

/**
 * @param {import('knex')} knex
 */
exports.down = async function (knex) {
    // drop in any order since they are independent
    await Promise.all(
        [tableNames.user, tableNames.address].map((tableName) =>
            knex.schema.dropTableIfExists(tableName)
        )
    );
};
