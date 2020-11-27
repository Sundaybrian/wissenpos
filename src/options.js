const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Wissenspos API",
            version: "1.0.0",
            description:
                "The APi for the wissenspos restaurant management system",
            license: {
                name: "MIT",
                url: "https://",
            },
            contact: {
                name: "The Wissenspos API",
                url: "https://.com",
                email: "info@wissensof.com",
            },
        },
        servers: [
            {
                url: "http://localhost:5000/api/v1",
                description: "development server",
            },
            {
                url: "https://wissenspos.herokuapp.com/api/v1",
                description: "production server",
            },
        ],
    },
    apis: ["./api/auth/auth.routes.js"],
};

module.exports = options;
