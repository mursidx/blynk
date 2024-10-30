// Import the required modules
const mongoose = require("mongoose");
const Joi = require("joi");

// Define the admin schema with Mongoose validation
const adminSchema = mongoose.Schema(
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
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["superadmin", "admin", "moderator"], // example roles
            default: "admin",
        },
    },
    { timestamps: true }
);

// Define Joi validation schema for admin data
const validateAdmin = (adminData) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid("superadmin", "admin", "moderator").required(),
    });

    return schema.validate(adminData);
};

// Export the model and the validation function
module.exports = {
    adminModel: mongoose.model("admin", adminSchema),
    validateAdmin,
};
