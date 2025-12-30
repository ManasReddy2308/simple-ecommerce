const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();

const products = [
  { name: 'Wireless Headphones', description: 'Comfortable noise-cancelling headphones', price: 99.99, image: 'https://picsum.photos/seed/headphones/400/300', countInStock: 10 },
  { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard', price: 79.99, image: 'https://picsum.photos/seed/keyboard/400/300', countInStock: 8 },
  { name: 'Gaming Mouse', description: 'Precision gaming mouse', price: 49.99, image: 'https://picsum.photos/seed/mouse/400/300', countInStock: 15 },
  { name: '4K Monitor', description: 'Ultra HD monitor for crisp visuals', price: 299.99, image: 'https://picsum.photos/seed/monitor/400/300', countInStock: 6 },
  { name: 'USB-C Hub', description: 'Multiport adapter for your laptop', price: 29.99, image: 'https://picsum.photos/seed/hub/400/300', countInStock: 25 },
  { name: 'Portable SSD', description: 'Fast external SSD storage', price: 129.99, image: 'https://picsum.photos/seed/ssd/400/300', countInStock: 12 },
  { name: 'Webcam', description: 'HD webcam for meetings', price: 39.99, image: 'https://picsum.photos/seed/webcam/400/300', countInStock: 20 },
  { name: 'Bluetooth Speaker', description: 'Loud portable speaker', price: 59.99, image: 'https://picsum.photos/seed/speaker/400/300', countInStock: 11 },
  { name: 'Smartwatch', description: 'Track your fitness and notifications', price: 199.99, image: 'https://picsum.photos/seed/watch/400/300', countInStock: 7 },
  { name: 'VR Headset', description: 'Immersive virtual reality', price: 399.99, image: 'https://picsum.photos/seed/vr/400/300', countInStock: 4 },
  { name: 'Drone', description: 'High-performance quadcopter', price: 499.99, image: 'https://picsum.photos/seed/drone/400/300', countInStock: 3 },
  { name: 'Action Camera', description: 'Record adventures in 4K', price: 149.99, image: 'https://picsum.photos/seed/actioncam/400/300', countInStock: 9 },
  { name: 'Graphics Tablet', description: 'Draw digitally with precision', price: 89.99, image: 'https://picsum.photos/seed/tablet/400/300', countInStock: 13 },
  { name: 'Noise Cancelling Earbuds', description: 'Compact sound with ANC', price: 129.99, image: 'https://picsum.photos/seed/earbuds/400/300', countInStock: 18 },
  { name: 'Smart Light', description: 'Color-changing smart bulb', price: 19.99, image: 'https://picsum.photos/seed/light/400/300', countInStock: 30 },
  { name: 'Router', description: 'Dual-band WiFi router', price: 59.99, image: 'https://picsum.photos/seed/router/400/300', countInStock: 14 },
  { name: 'Microphone', description: 'Studio-quality USB mic', price: 99.99, image: 'https://picsum.photos/seed/mic/400/300', countInStock: 10 },
  { name: 'Laptop Stand', description: 'Ergonomic laptop stand', price: 24.99, image: 'https://picsum.photos/seed/stand/400/300', countInStock: 40 },
  { name: 'Phone Gimbal', description: 'Stabilize smartphone video', price: 89.99, image: 'https://picsum.photos/seed/gimbal/400/300', countInStock: 6 },
  { name: 'Charging Cable', description: 'Durable fast-charging cable', price: 9.99, image: 'https://picsum.photos/seed/cable/400/300', countInStock: 100 }
];

const seed = async () => {
  await connectDB();
  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Seeded products');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();