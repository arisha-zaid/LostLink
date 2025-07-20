const Joi = require('joi');

module.exports.Itemschema = Joi.object({
    title : Joi.string().required(),
    description:Joi.string().required(),
    location:Joi.string().required(),
    dateLost:Joi.date().required(),
    category:Joi.string().required(),
    imageUrl:Joi.string().allow("",null),
    type:Joi.string().valid('lost', 'found').default('lost'),
    status:Joi.string().valid('open', 'claimed').default('open'),
});

module.exports.Claimschema = Joi.object({
  message: Joi.string().min(10).max(500).required()
});