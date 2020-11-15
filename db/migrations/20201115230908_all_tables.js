
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
        table.string('name').notNullable();
        url(table, 'logo_url');
        table.string('description', 1000);
        url(table, 'website_url');
        email(table, 'email');
        references(table, tableNames.address);
        references(table,tableNames.user,'owner', true)
        addDefaultColumns(table);
      }),
      await knex.schema.createTable(tableNames.category, (table) => {
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
      await knex.schema.createTable(tableNames.menu, (table) => {
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
      await knex.schema.createTable(tableNames.menuCategory, (table) => {
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
      await knex.schema.createTable(tableNames.item, (table) => {
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
      await knex.schema.createTable(tableNames.menuItem, (table) => {
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
      await knex.schema.createTable(tableNames.order, (table) => {
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
      await knex.schema.createTable(tableNames.orderItem, (table) => {
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
      await knex.schema.createTable(tableNames.payments, (table) => {
        table.increments().notNullable();
        table.string('name').notNullable();
        url(table, 'logo_url');
        table.string('description', 1000);
        url(table, 'website_url');
        email(table, 'email');
        references(table, tableNames.address);
        references(table,tableNames.user,'owner', true)
        addDefaultColumns(table);
      })
};


/**
 * @param {import('knex')} knex
 */
exports.down = function (knex) {
    // drop in any order since they are independent
    await Promise.all([
        tableNames.user,
        tableNames.customer,
        tableNames.address
    ].map((tableName) => knex.schema.dropTableIfExists(tableName)));
};
