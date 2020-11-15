
const tableNames = require("../../src/constants/tableNames");

const { addDefaultColumns, references, url, email } = require("../../src/utils/tableUtils");


/**
 * @param {import('knex')} knex
 */
exports.up = function (knex) {
    // starting with tables without fk reference
    await knex.schema.createTable(tableNames.company, (table) => {
        table.increments().notNullable();
        table.string('name').notNullable();
        url(table, 'logo_url');
        table.string('description', 1000);
        url(table, 'website_url');
        email(table, 'email');
        references(table, tableNames.address);
        references(table,tableNames.user,'owner', true)
        addDefaultColumns(table);
      }),
      await knex.schema.createTable(tableNames.accounts, (table) => {
        table.increments().notNullable();
        references(table, tableNames.company,null,true);
        references(table,tableNames.user,'staff_id', true)
        addDefaultColumns(table);
      }),
      await knex.schema.createTable(tableNames.category, (table) => {
        table.increments().notNullable();
        table.string('name').notNullable();
        references(table,tableNames.company,null, true)
        addDefaultColumns(table);
      }),
      await knex.schema.createTable(tableNames.menu, (table) => {
        table.increments().notNullable();
        table.string('name').notNullable();
        url(table, 'cover_url');
        table.string('description', 1000);
        references(table,tableNames.company,null, true)
        table.boolean("active").defaultTo(false);
        addDefaultColumns(table);
      }),
      await knex.schema.createTable(tableNames.menuCategory, (table) => {
        table.increments().notNullable();
        references(table, tableNames.category,null, true);
        references(table,tableNames.menu,null, true)
        addDefaultColumns(table);
      }),
      await knex.schema.createTable(tableNames.menuItem, (table) => {
        table.increments().notNullable();
        table.string('name').notNullable();
        references(table, tableNames.menu,null, true);
        references(table,tableNames.item,null, true);
        references(table,tableNames.category,null, true);
        table.boolean("available").notNullable().defaultTo(true);
        addDefaultColumns(table);
      }),
      await knex.schema.createTable(tableNames.order, (table) => {
        table.increments().notNullable();
        references(table, tableNames.customer, null, true);
        references(table,tableNames.company,null, true);
        table.enum('order_status',['New', 'Checkout', 'Paid', 'Failed', 'Complete']);
        table.enum('purchase_status',['paid','unpaid']);
        table.float("subtotal")
        addDefaultColumns(table);
      }),
      await knex.schema.createTable(tableNames.orderItem, (table) => {
        table.increments().notNullable();
        references(table, tableNames.orderItem, null, true);
        references(table,tableNames.item,null, true);
        table.float("price").notNullable().defaultTo(0);
        table.integer("quantity").notNullable().defaultTo(0);
        addDefaultColumns(table);
      }),
      await knex.schema.createTable(tableNames.payments, (table) => {
        table.increments().notNullable();
        references(table, tableNames.customer, null, true);
        references(table,tableNames.order,null, true);
        table.enum('payment_method',['Card','Cash', 'Mpesa']);
        table.string('payment_code',127);
        table.float('amount').notNullable();
        addDefaultColumns(table);
      }),

};


/**
 * @param {import('knex')} knex
 */
exports.down = function (knex) {
    // drop in any order since they are independent
    await Promise.all([
        tableNames.company,
        tableNames.accounts,
        tableNames.category,
        tableNames.menu,
        tableNames.menuCategory,
        tableNames.menuItem,
        tableNames.order,
        tableNames.orderItem,
        tableNames.payments
    ].reverse().map((tableName) => knex.schema.dropTableIfExists(tableName)));
};
