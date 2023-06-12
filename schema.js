const Joi=require('joi');
const campgroundSchema=Joi.object({
    campground:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().min(0),
        location:Joi.string().required(),
        description:Joi.string().required(),
        otype:Joi.string().required(),
        website:Joi.string().required(),
        
    }).required(),
    deleteImages:Joi.array(),
    stockAvail:Joi.object()
})
module.exports.campgroundSchema=campgroundSchema;
module.exports.reviewSchema=Joi.object({
    rating:Joi.number().min(1).max(5).required(),
    body:Joi.string().required()
})