const Joi = require("joi");
const validateRequest = require("../../_middlewares/validateRequest");

exports.updateSchema = (req, res, next) => {
    const schemaRules = {
        firstName: Joi.string().empty(""),
        lastName: Joi.string().empty(""),
        email: Joi.string().email().empty(""),
        role: Joi.string().min(5).empty(""),
        password: Joi.string().min(8).empty(""),
        confirmPassword: Joi.string().valid(Joi.ref("password")).empty(""),
    };

    const schema = Joi.object(schemaRules).with("password", "confirmPassword");

    validateRequest(req, next, schema);
};
