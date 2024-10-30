const mongoose = require("mongoose");
const Joi = require("joi");

// Define the category schema with Mongoose validation and timestamps
const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
    },
    { timestamps: true }
);

// Joi validation for category data
const validateCategory = (categoryData) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
    });

    return schema.validate(categoryData);
};

module.exports = {
    categoryModel: mongoose.model("category", categorySchema),
    validateCategory,
};
