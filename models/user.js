// Import the required modules
const mongoose = require("mongoose");
const Joi = require("joi");



// Define the user schema with Mongoose validation
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^\S+@\S+\.\S+$/,
        },
        password: {
            type: String,
            minlength: 6,
        },
        phone: {
            type: Number,
            min: 1000000000,
            max: 9999999999,
        }, address: {
            type: String,
            minlength: 5,
            maxlength: 100,
        },
    },
    { timestamps: true }
);

// Define Joi validation schema for user data
const validateUser = (userData) => {
    const addressSchema = Joi.object({
        state: Joi.string().min(2).max(50).required(),
        zip: Joi.number().min(10000).max(99999).required(),
        city: Joi.string().min(2).max(50).required(),
        street: Joi.string().min(2).max(100).required(),
    });

    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6),
        phone: Joi.number().min(1000000000).max(9999999999),
    });

    return schema.validate(userData);
};

// Export the model and the validation function
module.exports = {
    userModel: mongoose.model("user", userSchema),
    validateUser,
};
