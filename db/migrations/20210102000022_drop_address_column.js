const tableNames = require("../../src/constants/tableNames");

const { references } = require("../../src/utils/tableUtils");

exports.up = async function (knex) {
    await knex.schema.table(tableNames.company, (table) => {
        table.dropColumn("address_id");
    });
};

exports.down = async function (knex) {
    await knex.schema.table(tableNames.company, (table) => {
        references(table, tableNames.address, null, false);
    });
};
