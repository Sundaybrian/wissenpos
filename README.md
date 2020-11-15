## Wissenpos

A fullstack app (frontend, backend) for restaurant management

## Backend Setup

-   Create `.env` with your values. A sample env is provided
-   `npm install` to install dependencies
-   You can run the db as a container using `docker-compose up`
-   Migrate db using `npm run migrate`

### Entities

-   All entities will have, created_at, updated_at and possibly deleted at
-   Possibility for only soft deletions

-   [] user
-   [] customer,
-   [] address",
-   [] company",
-   [] accounts",
-   [] category",
-   [] menu,
-   [] menuCategory",
-   [] item,
-   [] menuItem",
-   [] order",
-   [] orderItem",
-   [] payments",

## commands

-   sudo docker-compose up
-   sudo docker volume rm \$(sudo docker volume ls -q)
-   sudo docker system prune -a
-   sudo docker-compose down -v

## knex

-   npm i knex
-   npx knex init ## initialize knex

## knex migrations and seeds

-   npx knex migrate:make migration_name // create a migration file
-   npx knex migrate:latest // migrate the most recent migration file\
-   npx knex migrate:latest -- --debug // show the sql
-   npx knex migrate:rollback
-   npx knex seed:make initial
-   npx knex seed:run
-   npx knex migrate:rollback --env test_environment e.g prod, dev test

## eslint

-   npx eslint --init

## jest

-   npx jest init

## Objection js

-   ORM

```javascript
const { Model } = require("objection");

class Person extends Model {
    // Table name is the only required property.
    static get tableName() {
        return "persons";
    }

    // Each model must have a column (or a set of columns) that uniquely
    // identifies the rows. The column(s) can be specified using the `idColumn`
    // property. `idColumn` returns `id` by default and doesn't need to be
    // specified unless the model's primary key is something else.
    static get idColumn() {
        return "id";
    }

    // Methods can be defined for model classes just as you would for
    // any JavaScript class. If you want to include the result of these
    // method in the output json, see `virtualAttributes`.
    fullName() {
        return this.firstName + " " + this.lastName;
    }

    // Optional JSON schema. This is not the database schema!
    // No tables or columns are generated based on this. This is only
    // used for input validation. Whenever a model instance is created
    // either explicitly or implicitly it is checked against this schema.
    // See http://json-schema.org/ for more info.
    static get jsonSchema() {
        return {
            type: "object",
            required: ["firstName", "lastName"],

            properties: {
                id: { type: "integer" },
                parentId: { type: ["integer", "null"] },
                firstName: { type: "string", minLength: 1, maxLength: 255 },
                lastName: { type: "string", minLength: 1, maxLength: 255 },
                age: { type: "number" },

                // Properties defined as objects or arrays are
                // automatically converted to JSON strings when
                // writing to database and back to objects and arrays
                // when reading from database. To override this
                // behaviour, you can override the
                // Model.jsonAttributes property.
                address: {
                    type: "object",
                    properties: {
                        street: { type: "string" },
                        city: { type: "string" },
                        zipCode: { type: "string" },
                    },
                },
            },
        };
    }

    // This object defines the relations to other models.
    static get relationMappings() {
        // Importing models here is a one way to avoid require loops.
        const Animal = require("./Animal");
        const Movie = require("./Movie");

        return {
            pets: {
                relation: Model.HasManyRelation,
                // The related model. This can be either a Model
                // subclass constructor or an absolute file path
                // to a module that exports one. We use a model
                // subclass constructor `Animal` here.
                modelClass: Animal,
                join: {
                    from: "persons.id",
                    to: "animals.ownerId",
                },
            },

            movies: {
                relation: Model.ManyToManyRelation,
                modelClass: Movie,
                join: {
                    from: "persons.id",
                    // ManyToMany relation needs the `through` object
                    // to describe the join table.
                    through: {
                        // If you have a model class for the join table
                        // you need to specify it like this:
                        // modelClass: PersonMovie,
                        from: "persons_movies.personId",
                        to: "persons_movies.movieId",
                    },
                    to: "movies.id",
                },
            },

            children: {
                relation: Model.HasManyRelation,
                modelClass: Person,
                join: {
                    from: "persons.id",
                    to: "persons.parentId",
                },
            },

            parent: {
                relation: Model.BelongsToOneRelation,
                modelClass: Person,
                join: {
                    from: "persons.parentId",
                    to: "persons.id",
                },
            },
        };
    }
}
```

## Setup

```
npm install
```

## Lint

```
npm run lint
```

## Test

```
npm run test
```

## Development

```
npm run dev
```
