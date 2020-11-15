function addDefaultColumns(table) {
    table.timestamps(false, true);
    table.datetime("deleted_at");
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

module.exports = {
    addDefaultColumns,
    references,
};
