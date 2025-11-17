// order.validator.js
const Joi = require('joi');
const mongoose = require('mongoose');

// Helper to validate ObjectId
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

const orderItemSchema = Joi.object({
  product: Joi.string().custom(objectId).required().messages({
    'any.invalid': 'Invalid product ID',
    'any.required': 'Product is required',
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number',
    'number.min': 'Quantity must be at least 1',
  }),

  unitPrice: Joi.number().min(0).required().messages({
    'number.base': 'Unit price must be a number',
    'number.min': 'Unit price cannot be negative',
  }),
});

const orderSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required().messages({
    'array.base': 'Items must be an array',
    'array.min': 'Order must contain at least one item',
  }),
  totalAmount: Joi.number().min(0).required().messages({
    'number.base': 'Total amount must be a number',
    'number.min': 'Total amount cannot be negative',
  }),
  status: Joi.string()
    .valid('pending', 'paid', 'cancelled')
    .default('pending')
    .messages({
      'any.only': 'Status must be one of: pending, paid, cancelled',
    }),
  user: Joi.string().custom(objectId).required().messages({
    'any.invalid': 'Invalid user ID',
    'any.required': 'User ID is required',
  }),
});

module.exports = orderSchema;
