// Update with your config settings.

module.exports = {
    test: {
        client: "sqlite3",
        connection: {
            filename: "./test.sqlite3",
        },
        migrations: {
            directory: __dirname + "/db/migrations",
        },

        seeds: {
            directory: __dirname + "/db/seeds",
        },
    },
    development: {
        client: "sqlite3",
        connection: {
            filename: "./dev.sqlite3",
        },
        migrations: {
            directory: __dirname + "/db/migrations",
        },

        seeds: {
            directory: __dirname + "/db/seeds",
        },
    },

    staging: {
        client: "pg",
        connection: {
            host: "127.0.0.1",
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

    //   production: {
    //     client: 'postgresql',
    //     connection: {
    //       database: 'my_db',
    //       user:     'username',
    //       password: 'password'
    //     },
    //     pool: {
    //       min: 2,
    //       max: 10
    //     },
    //     migrations: {
    //       tableName: 'knex_migrations'
    //     }
    //   }
};
