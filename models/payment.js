const mongoose = require("mongoose");
const Joi = require("joi");

// Define the payment schema with Mongoose validation and timestamps
const paymentSchema = mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        method: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

// Joi validation for payment data
const validatePayment = (paymentData) => {
    const schema = Joi.object({
        order: Joi.string().required(), // Should be a valid ObjectId string
        amount: Joi.number().min(0).required(),
        method: Joi.string().required(),
        status: Joi.string().required(),
        transactionId: Joi.string().required(),
    });

    return schema.validate(paymentData);
};

module.exports = {
    paymentModel: mongoose.model("payment", paymentSchema),
    validatePayment,
};
