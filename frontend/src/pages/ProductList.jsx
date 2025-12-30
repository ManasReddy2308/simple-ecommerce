import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, addToCart } from '../api'

export default function ProductList({ token }) {
  const [products, setProducts] = useState([])

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    try {
      const res = await getProducts()
      setProducts(res)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleAdd(productId) {
    if (!token) return alert('Login to add to cart')
    try {
      const cart = await addToCart(productId, 1, token)
      // notify app of updated cart
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }))
      alert('Added to cart')
    } catch (err) {
      console.error(err)
      alert(err.message || 'Error adding to cart')
    }
  }

  return (
    <div>
      <h2>Products</h2>
      <div className="grid">
        {products.map(p => (
          <div key={p._id} className="card">
            <img src={p.image || '/placeholder.png'} alt={p.name} style={{ width: '100%', borderRadius: 8, objectFit: 'cover', height: 140 }} />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p><strong>${p.price.toFixed(2)}</strong></p>
            <div className="actions">
              <Link to={`/product/${p._id}`}>Details</Link>
              <button className="btn-primary" onClick={() => handleAdd(p._id)}>Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
