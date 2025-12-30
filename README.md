# Simple Ecommerce (React + Express + MongoDB)

This repository contains a small, simplified online store with:

- Backend: Express.js + MongoDB (Mongoose) — user auth (JWT), product APIs, cart, and dummy checkout
- Frontend: React (Vite/vanilla) — product listing, product details, cart UI, login/signup

## Quick start (local)

1. Ensure MongoDB is running locally (default: `mongodb://127.0.0.1:27017`).

2. Backend:
   - cd backend
   - copy `.env.example` to `.env` and set `JWT_SECRET` and `MONGO_URI` if needed
   - npm install
   - npm run seed   # seeds sample products
   - npm run dev    # runs server on port 5000

3. Frontend:
   - cd frontend
   - npm install
   - npm run dev    # starts vite dev server (or run using your preferred method)

4. Open the front-end URL (by default Vite uses port 5173) and browse products, sign up, login, add to cart and place an order (dummy checkout).

## Notes
- The backend uses simple JWT auth; include the token as `Authorization: Bearer <token>` in requests.
- This is intentionally simplified for learning: there is no admin UI, payment handling, or complex validation.

Happy hacking! ⚡
