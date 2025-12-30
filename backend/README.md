# Ecommerce Backend

Simple Express backend with MongoDB (Mongoose).

Endpoints:
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/products
- GET /api/products/:id
- POST /api/products (requires auth)
- GET /api/cart
- POST /api/cart
- PUT /api/cart
- DELETE /api/cart/:productId
- POST /api/orders/checkout
- GET /api/orders

Install and run:

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. npm install
3. npm run seed
4. npm run dev

Example quick tests (replace host if needed):

- Signup:
  curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"password\":\"password\"}"

- Login (returns token):
  curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"alice@example.com\",\"password\":\"password\"}"

- List products:
  curl http://localhost:5000/api/products

- Add to cart (replace TOKEN):
  curl -X POST http://localhost:5000/api/cart -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d "{\"productId\":\"<PRODUCT_ID>\",\"quantity\":1}"

- Checkout:
  curl -X POST http://localhost:5000/api/orders/checkout -H "Authorization: Bearer <TOKEN>"
