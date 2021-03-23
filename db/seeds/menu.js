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

    const [category_id] = await knex(tableNames.category)
        .insert([
            {
                name: "Lunch",
                menu_id,
            },
            {
                name: "BreakFast",
                menu_id,
            },
            {
                name: "Dinner",
                menu_id,
            },
            {
                name: "Drinks",
                menu_id,
            },
        ])
        .returning("id");

    await knex(tableNames.item).insert([
        {
            name: "Beef matumbo seed",
            price: 200,
            quantity: 100,
            description: "sweet beef matumbo seed",
            image_url:
                "https://i.pinimg.com/736x/bf/6d/ff/bf6dff9d4f719e650beb1488208ba39d.jpg",
            category_id,
        },
        {
            name: "Beef matumbo seed",
            price: 200,
            quantity: 100,
            description: "sweet beef matumbo seed",
            image_url:
                "https://i.pinimg.com/736x/bf/6d/ff/bf6dff9d4f719e650beb1488208ba39d.jpg",
            category_id,
        },
        {
            name: "Beef matumbo seed",
            price: 200,
            quantity: 100,
            description: "sweet beef matumbo seed",
            image_url:
                "https://i.pinimg.com/736x/bf/6d/ff/bf6dff9d4f719e650beb1488208ba39d.jpg",
            category_id,
        },
        {
            name: "Beef matumbo seed",
            price: 200,
            quantity: 100,
            description: "sweet beef matumbo seed",
            image_url:
                "https://i.pinimg.com/736x/bf/6d/ff/bf6dff9d4f719e650beb1488208ba39d.jpg",
            category_id,
        },
        {
            name: "Beef matumbo seed",
            price: 200,
            quantity: 100,
            description: "sweet beef matumbo seed",
            image_url:
                "https://i.pinimg.com/736x/bf/6d/ff/bf6dff9d4f719e650beb1488208ba39d.jpg",
            category_id,
        },
    ]);
};
