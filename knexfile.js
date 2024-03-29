// Update with your config settings.
require("dotenv").config();
const parse = require("pg-connection-string").parse;
const pgconfig = parse(process.env.DATABASE_URL);
pgconfig.ssl = { rejectUnauthorized: false }; // for heroku

module.exports = {
    test: {
        client: "pg",
        debug: true,
        connection: {
            // host: "127.0.0.1",
            database: process.env.POSTGRES_DB_TEST,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        },
        migrations: {
            directory: __dirname + "/db/migrations",
        },

        seeds: {
            directory: __dirname + "/db/seeds",
        },
    },

    development: {
        client: "pg",
        connection: {
            // host: "127.0.0.1",
            database: process.env.POSTGRES_DB,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
        },
        migrations: {
            directory: __dirname + "/db/migrations",
        },

        seeds: {
            directory: __dirname + "/db/seeds",
        },
    },

    production: {
        client: "pg",
        connection: pgconfig,
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            directory: __dirname + "/db/migrations",
        },

        seeds: {
            directory: __dirname + "/db/seeds",
        },
    },
};
