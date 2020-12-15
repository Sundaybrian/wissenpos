const Joi = require("joi");
const validateRequest = require("../../../_middlewares/validateRequest");

exports.createOrder = (req, res, next) => {
    const schema = Joi.object({
        item: Joi.number().required(),
        quantity: Joi.number(),
    });
    validateRequest(req, next, schema);
};


exports.updateOrderSchema = (req, res, next) =>{
    const schema = Joi.object({
        order_status: Joi.string().empty("");
        purchase_status: Joi.string().empty("")
    });

    validateRequest(req,next, schema);
}


exports.companyOrderSchema = (req, res, next) =>{
    const schema = Joi.object({
        customer_id:Joi.number().empty(),
        order_status: Joi.string().empty("");
        purchase_status: Joi.string().empty("")
    });

    validateRequest(req,next, schema);
}

