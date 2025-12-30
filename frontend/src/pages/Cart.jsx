import React, { useEffect, useState } from 'react'
import { getCart, updateCart, removeFromCart, checkout } from '../api'

export default function Cart({ token }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (token) fetchCart(); else setLoading(false) }, [token])

  async function fetchCart() {
    try {
      const res = await getCart(token)
      setCart(res)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  async function handleQty(productId, qty) {
    try {
      const res = await updateCart(productId, qty, token)
      setCart(res)
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: res }))
    } catch (err) { console.error(err) }
  }

  async function handleRemove(productId) {
    try {
      const res = await removeFromCart(productId, token)
      setCart(res)
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: res }))
    } catch (err) { console.error(err) }
  }

  async function handleCheckout() {
    try {
      const res = await checkout(token)
      alert(`Order placed (id: ${res.orderId}) — total: $${res.total}`)
      setCart([])
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }))
    } catch (err) { console.error(err); alert(err.message || 'Checkout failed') }
  }

  if (!token) return <div>Please login to view your cart</div>
  if (loading) return <div>Loading...</div>

  const total = cart.reduce((s, i) => {
    const price = i.product && i.product.price ? i.product.price : 0
    return s + (i.quantity || 0) * price
  }, 0)

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>Cart is empty</p> : (
        <div>
          {cart.map(item => {
            const prod = item.product || { name: '[removed]', price: 0 }
            const key = item._id || (prod && prod._id) || Math.random()
            const productIdForAction = (prod && prod._id) ? prod._id : item._id
            return (
            <div key={key} className="cart-item">
              <div style={{width:240}}>{prod.name}</div>
              <div>
                <button disabled={!prod._id} onClick={() => handleQty(productIdForAction, Math.max(1, item.quantity - 1))}>-</button>
                <span style={{margin: '0 8px'}}>{item.quantity}</span>
                <button disabled={!prod._id} onClick={() => handleQty(productIdForAction, item.quantity + 1)}>+</button>
              </div>
              <div>${((prod.price || 0) * item.quantity).toFixed(2)}</div>
              <div><button onClick={() => handleRemove(productIdForAction)}>Remove</button></div>
            </div>)
          })}
          <h3>Total: ${total.toFixed(2)}</h3>
          <button className="btn-primary" onClick={handleCheckout}>Place Order</button>
        </div>
      )}
    </div>
  )
}
