const Joi = require("joi");
const validateRequest = require("../../../../../_middlewares/validateRequest");

exports.createSchema = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
        description: Joi.string().required(),
        image_url: Joi.string(),
        category_id: Joi.number().required(),
    });
    validateRequest(req, next, schema);
};

exports.updateSchema = (req, res, next) => {
    const schemaRules = {
        name: Joi.string().empty(""),
        price: Joi.number().empty(""),
        quantity: Joi.number().empty(""),
        description: Joi.string().empty(""),
        image_url: Joi.string(),
        category_id: Joi.number().empty(""),
    };

    const schema = Joi.object(schemaRules);

    validateRequest(req, next, schema);
};
