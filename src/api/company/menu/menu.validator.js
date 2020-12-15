const Joi = require("joi");
const validateRequest = require("../../../_middlewares/validateRequest");

exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        cover_url: Joi.string(),
    });
    validateRequest(req, next, schema);
};

exports.updateSchema = (req, res, next) => {
    const schemaRules = {
        name: Joi.string().empty(""),
        description: Joi.string().empty(""),
        cover_url: Joi.string().empty(""),
    };

    const schema = Joi.object(schemaRules);

    validateRequest(req, next, schema);
};
