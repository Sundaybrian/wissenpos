const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");

// Swagger stuff
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");
const options = require("./options");

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
    });
});

app.use("/api/v1", api);
// swagger docs
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        ...options,
        explorer: true,
    })
);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
