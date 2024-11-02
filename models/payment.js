const mongoose = require("mongoose");
const Joi = require("joi");

// Define the payment schema with Mongoose validation and timestamps
const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
    },
    signature: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
        min: 0, // Added minimum value to enforce positive amounts
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
}, { timestamps: true });

// Joi validation for payment data
const validatePayment = (paymentData) => {
    const schema = Joi.object({
        orderId: Joi.string().required(), // Corrected to match the schema's property
        paymentId: Joi.string().optional(), // Made paymentId optional to match the schema
        signature: Joi.string().optional(), // Made signature optional to match the schema
        amount: Joi.number().min(0).required(),
        currency: Joi.string().required(), // Added currency validation
        status: Joi.string().optional(), // Made status optional to allow default
        transactionId: Joi.string().optional(), // Made transactionId optional to match the schema
    });

    return schema.validate(paymentData);
};

module.exports = {
    paymentModel: mongoose.model("Payment", paymentSchema), // Changed model name to be singular
    validatePayment,
};
