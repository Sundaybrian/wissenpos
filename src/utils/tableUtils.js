function addDefaultColumns(table) {
    table.timestamps(false, true);
    table.datetime("deleted_at");
}

function addDefaultColumnsUser(table) {
    table.increments().notNullable();
    table.string("firstName", 50).notNullable();
    table.string("lastName", 50).notNullable();
    table.string("email", 254).notNullable().unique();
    table.string("phoneNumber", 15).notNullable().unique();
    table.string("password", 180).notNullable();
    table.string("role", 10).notNullable();
    table.boolean("active").notNullable().defaultTo(false);
    table.boolean("verified").notNullable().defaultTo(false);
    table.string("image_url", 2000);
}

function references(table, tableName, columnName = null, notNullable = true) {
    const definition = table
        .integer(`${columnName || tableName}_id`)
        .unsigned()
        .references("id")
        .inTable(tableName)
        .onDelete("cascade");

    if (notNullable) {
        definition.notNullable();
    }

    return definition;
}

function url(table, columnName) {
    table.string(columnName, 2000);
}

function email(table, columnName) {
    return table.string(columnName, 254);
}

module.exports = {
    addDefaultColumns,
    addDefaultColumnsUser,
    references,
    url,
    email,
};
