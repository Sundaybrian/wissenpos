const tableNames = require("../../src/constants/tableNames");

exports.seed = async function (knex) {
    const [company, user] = await Promise.all([
        knex(tableNames.company)
            .where({
                name: "my-company",
            })
            .first(),
        knex(tableNames.user)
            .where({
                firstName: "sunday",
            })
            .first(),
    ]);

    const [menu_id] = await knex(tableNames.menu)
        .insert({
            name: "super menu",
            description: "super menu desc",
            company_id: company.id,
        })
        .returning("id");

    await knex(tableNames.category).insert([
        {
            name: "cat1",
            menu_id,
        },
    ]);
};
