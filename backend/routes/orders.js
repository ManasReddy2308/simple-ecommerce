const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');

// POST /api/orders/checkout
router.post('/checkout', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    if (!user.cart.length) return res.status(400).json({ msg: 'Cart is empty' });

    // Create order from cart (dummy checkout)
    const items = user.cart.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));

    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    const order = new Order({ user: user._id, items, total });
    await order.save();

    // clear cart
    user.cart = [];
    await user.save();

    res.json({ orderId: order._id, total, order });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/orders - list user's orders. Optional query ?status=cancelled|placed
router.get('/', auth, async (req, res) => {
  try {
    const query = { user: req.user.id };
    if (req.query.status) query.status = req.query.status;
    const orders = await Order.find(query).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/orders/:id/cancel - cancel an order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    if (order.user.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
    if (order.status === 'cancelled') return res.status(400).json({ msg: 'Order already cancelled' });

    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;