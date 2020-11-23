const crypto = require("crypto");
const bcrypt = require("bcrypt");

const tableNames = require("../../src/constants/tableNames");
const Role = require("../../src/utils/role");

exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await Promise.all(
        Object.keys(tableNames).map((name) => {
            return knex(name).del();
        })
    );

    const password = await bcrypt.hash("12345678yh", 10);

    const userOwner = {
        email: "sunday@owner.com",
        firstName: "sunday",
        lastName: "owner",
        password,
        role: Role.owner,
        active: true,
        phoneNumber: "0712382366",
    };

    const adminUser = {
        email: "admin@admin.com",
        firstName: "admin",
        lastName: "admin",
        password,
        role: Role.admin,
        phoneNumber: "0712382367",
    };

    await knex(tableNames.user).insert(userOwner);
    await knex(tableNames.user).insert(adminUser);
};
