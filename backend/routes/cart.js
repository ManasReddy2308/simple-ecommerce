const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

// GET /api/cart - get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    await user.populate('cart.product');

    // remove items whose product no longer exists
    const filtered = user.cart.filter(i => i.product !== null);
    if (filtered.length !== user.cart.length) {
      user.cart = filtered;
      await user.save();
    }

    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/cart - add item { productId, quantity }
router.post('/', auth, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    const existing = user.cart.find(item => item.product.toString() === productId);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + (quantity || 1), product.countInStock);
    } else {
      user.cart.push({ product: productId, quantity: quantity || 1 });
    }

    await user.save();
    const populated = await user.populate('cart.product');
    res.json(populated.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/cart - update quantity { productId, quantity }
router.put('/', auth, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const item = user.cart.find(i => i.product.toString() === productId);
    if (!item) return res.status(404).json({ msg: 'Item not in cart' });
    item.quantity = quantity;
    await user.save();
    const populated = await user.populate('cart.product');
    res.json(populated.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/cart/:productId  - productId can also be cart item id
router.delete('/:productId', auth, async (req, res) => {
  try {
    const id = req.params.productId;
    const user = await User.findById(req.user.id);

    // Try remove by matching product id
    let originalLength = user.cart.length;
    user.cart = user.cart.filter(i => {
      // i.product may be ObjectId or populated object
      const prodId = (i.product && i.product._id) ? i.product._id.toString() : (i.product ? i.product.toString() : null);
      return prodId !== id && (i._id.toString() !== id);
    });

    if (user.cart.length === originalLength) {
      // no change: not found
      return res.status(404).json({ msg: 'Item not found in cart' });
    }

    await user.save();
    const populated = await user.populate('cart.product');
    res.json(populated.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;