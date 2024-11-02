const mongoose = require("mongoose");
const Joi = require("joi");

// Define the order schema with Mongoose validation and timestamps
const orderSchema = mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true,
            },
        ],
        totalprice: {
            type: Number,
            required: true,
            min: 0,
        },
        address: {
            type: String,
            minlength: 5,
            maxlength: 100,
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "confirmed", "shipped", "delivered", "canceled"], // Example statuses
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "payment",
            required: true,
        },
        delivery: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "delivery",
        },
    },
    { timestamps: true }
);

// Joi validation for order data
const validateOrder = (orderData) => {
    const schema = Joi.object({
        user: Joi.string().required(), // Should be a valid ObjectId string
        products: Joi.array().items(Joi.string().required()).min(1).required(), // Array of ObjectId strings
        totalprice: Joi.number().min(0).required(),
        address: Joi.string().min(5).max(100).required(),
        status: Joi.string().valid("pending", "confirmed", "shipped", "delivered", "canceled").required(),
        payment: Joi.string().required(), // Should be a valid ObjectId string
        delivery: Joi.string().required(), // Should be a valid ObjectId string
    });

    return schema.validate(orderData);
};

module.exports = {
    orderModel: mongoose.model("order", orderSchema),
    validateOrder,
};
