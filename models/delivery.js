const mongoose = require("mongoose");
const Joi = require("joi");

// Define the delivery schema with Mongoose validation and timestamps
const deliverySchema = mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order",
            required: true,
        },
        deliveryBoy: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "in-transit", "delivered", "canceled"], // Example statuses
        },
        trackingURL: {
            type: String,
            match: /^(https?:\/\/[^\s$.?#].[^\s]*)?$/, // Optional URL format
        },
        estimatedDeliveryTime: {
            type: Number,
            min: 1, // Represents hours, ensure positive value
        },
    },
    { timestamps: true }
);

// Joi validation for delivery data
const validateDelivery = (deliveryData) => {
    const schema = Joi.object({
        order: Joi.string().required(), // ObjectId as string
        deliveryBoy: Joi.string().min(3).max(50).required(),
        status: Joi.string().valid("pending", "in-transit", "delivered", "canceled").required(),
        trackingURL: Joi.string().uri(), // Optional URI
        estimatedDeliveryTime: Joi.number().min(1).optional(),
    });

    return schema.validate(deliveryData);
};

module.exports = {
    deliveryModel: mongoose.model("delivery", deliverySchema),
    validateDelivery,
};
