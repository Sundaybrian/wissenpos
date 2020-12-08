const Joi = require("joi");
const validateRequest = require("../../../_middlewares/validateRequest");

exports.createOrder = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        menu_id: Joi.number().required(),
        owner_id: Joi.number().required(),
    });
    validateRequest(req, next, schema);
};
