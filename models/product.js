const mongoose = require("mongoose");
const Joi = require("joi");

// Define the product schema with Mongoose validation and timestamps
const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            required: true,
        },
        stock: {
            type: Boolean,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

// Joi validation for product data
const validateProduct = (productData) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().required(),
        stock: Joi.boolean().required(),
        description: Joi.string().optional(),
        image: Joi.string().optional(), 
    });

    return schema.validate(productData);
};

module.exports = {
    productModel: mongoose.model("product", productSchema),
    validateProduct,
};
