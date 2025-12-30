const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  quantity: Number
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [OrderItemSchema],
  total: Number,
  status: { type: String, enum: ['placed','cancelled'], default: 'placed' },
  cancelledAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);