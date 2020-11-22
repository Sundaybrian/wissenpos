const Knex = require("knex");
const { Model } = require("objection");

const knexFile = require("../knexfile");
const environment = process.env.NODE_ENV || "development";
const connectionConfig = knexFile[environment];

const db = Knex(connectionConfig);

Model.knex(db);

module.exports = db;
