const Joi = require("joi");
const validateRequest = require("../../_middlewares/validateRequest");

exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        logo_url: Joi.string(),
        website_url: Joi.string(),
        email: Joi.string().email().required(),
    });
    validateRequest(req, next, schema);
};

exports.updateSchema = (req, res, next) => {
    const schemaRules = {
        name: Joi.string().empty(""),
        description: Joi.string().empty(""),
        email: Joi.string().email().empty(""),
        owner: Joi.number().empty(""),
        logo_url: Joi.string().empty(""),
        website_url: Joi.string().empty(""),
    };

    const schema = Joi.object(schemaRules);

    validateRequest(req, next, schema);
};
