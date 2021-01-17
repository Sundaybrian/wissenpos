const Joi = require("joi");
const validateRequest = require("../../../_middlewares/validateRequest");

exports.createOrderSchema = (req, res, next) => {
    const schema = Joi.object({
        product_id: Joi.number().required(),
        quantity: Joi.number().required(),
        cart_id: Joi.string().required(),
    });
    validateRequest(req, next, schema);
};

exports.getOrderSchema = (req, res, next) => {
    const schema = Joi.object({
        cart_id: Joi.string().required(),
    });
    validateRequest(req, next, schema);
};

exports.updateOrderSchema = (req, res, next) => {
    const schema = Joi.object({
        order_status: Joi.string().empty(""),
        purchase_status: Joi.string().empty(""),
    });

    validateRequest(req, next, schema);
};

exports.companyOrderSchema = (req, res, next) => {
    const schema = Joi.object({
        customer_id: Joi.number().empty(),
        order_status: Joi.string().empty(""),
        purchase_status: Joi.string().empty(""),
    });

    validateRequest(req, next, schema);
};
