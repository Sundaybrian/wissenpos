const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "TheCodebuzz API",
            version: "1.0.0",
            description:
                "Thecodebuzz test service to demo how to document your API",
            license: {
                name: "MIT",
                url: "https://thecodebuzz.com",
            },
            contact: {
                name: "TheCodeBuzz",
                url: "https://thecodebuzz.com",
                email: "info@thecodebuzz.com",
            },
        },
        servers: [
            {
                url: "http://localhost:5000/",
            },
        ],
    },
    apis: [],
};

module.exports = options;
