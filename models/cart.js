const mongoose = require("mongoose");
const Joi = require("joi");

// Define the cart schema with Mongoose validation and timestamps
const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user", // Reference to the "user" collection
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product", // Reference to the "product" collection
                required: true,
            },
        ],
        totalprice: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

// Joi validation for cart data
const validateCart = (cartData) => {
    const schema = Joi.object({
        user: Joi.string().required(), // Should be a valid ObjectId string
        products: Joi.array().items(Joi.string().required()).min(1).required(), // Array of ObjectId strings
        totalprice: Joi.number().min(0).required(),
    });

    return schema.validate(cartData);
};

module.exports = {
    cartModel: mongoose.model("cart", cartSchema),
    validateCart,
};
