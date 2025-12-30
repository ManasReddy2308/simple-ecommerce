import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import ProductList from './pages/ProductList'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { getCart } from './api'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [cartCount, setCartCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) fetchCart()
    else setCartCount(0)
    const onCart = (e) => {
      const cart = e.detail || []
      const count = cart.reduce ? cart.reduce((s, i) => s + i.quantity, 0) : 0
      setCartCount(count)
    }

    window.addEventListener('cartUpdated', onCart)
    return () => window.removeEventListener('cartUpdated', onCart)  }, [token])

  async function fetchCart() {
    try {
      const cart = await getCart(token)
      const count = cart.reduce((s, i) => s + i.quantity, 0)
      setCartCount(count)
    } catch (err) {
      console.error(err)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/')
  }

  return (
    <div>
      <nav className="nav">
        <div className="brand"><Link to="/"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h18v6H3z"></path><path d="M5 13h14v8H5z"></path></svg> <span>MiniStore</span></Link></div>
        <div className="nav-actions">
          <Link to="/">Products</Link>
          <Link to="/cart">Cart ({cartCount})</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/orders/cancelled">Cancelled Orders</Link>
          {token ? (
            <button onClick={handleLogout} className="btn-ghost">Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={token ? <ProductList token={token} /> : <Login setToken={t => { localStorage.setItem('token', t); setToken(t) }n={token} /> : <Login setToken={t => { localStorage.setItem('token', t); setToken(t) }} />} />
          <Route path="/product/:id" element={<ProductDetails token={token} />} />
          <Route path="/cart" element={<Cart token={token} />} />
          <Route path="/orders" element={<Orders token={token} />} />
          <Route path="/orders/cancelled" element={<Orders token={token} status="cancelled" />} />
          <Route path="/orders/placed" element={<Orders token={token} status="placed" />} />
          <Route path="/login" element={<Login setToken={t => { localStorage.setItem('token', t); setToken(t) }} />} />
          <Route path="/signup" element={<Signup setToken={t => { localStorage.setItem('token', t); setToken(t) }} />} />
        </Routes>
      </main>
    </div>
  )
}
