const Joi = require('joi');
const validateRequest = require('../../../_middlewares/validateRequest');

exports.createSchema = (req, res, next) => {
  const schema = Joi.object({
    company_id: Joi.number().integer(),
    user: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phoneNumber: Joi.string().min(10).max(15).required(),
      role: Joi.string().min(5).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    }),
  });
  validateRequest(req, next, schema);
};

exports.updateSchema = (req, res, next) => {
  const schemaRules = {
    firstName: Joi.string().empty(''),
    lastName: Joi.string().empty(''),
    email: Joi.string().email().empty(''),
    phoneNumber: Joi.string().min(10).max(15).empty(''),
    password: Joi.string().min(8).empty(''),
    confirmPassword: Joi.string().valid(Joi.ref('password')).empty(''),
    image_url: Joi.string().empty(''),
  };

  const schema = Joi.object(schemaRules).with('password', 'confirmPassword');

  validateRequest(req, next, schema);
};
