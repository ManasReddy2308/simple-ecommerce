import React, { useEffect, useState } from 'react'
import { getOrders, cancelOrder } from '../api'
import { Link } from 'react-router-dom'

export default function Orders({ token, status: propStatus }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const statusFromProp = propStatus

  useEffect(() => { if (token) fetchOrders(); else setLoading(false) }, [token, statusFromProp])

  async function fetchOrders() {
    try {
      setLoading(true)
      const res = await getOrders(token, statusFromProp)
      setOrders(res)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  async function handleCancel(orderId) {
    if (!confirm('Cancel this order?')) return
    try {
      const res = await cancelOrder(orderId, token)
      setOrders(o => o.map(x => x._id === res._id ? res : x))
    } catch (err) { console.error(err); alert(err.message || 'Cancel failed') }
  }

  if (!token) return <div>Please login to view orders</div>
  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2>Your Orders {statusFromProp ? ` — ${statusFromProp}` : ''}</h2>
      <div style={{ marginBottom: 12 }}>
        <Link to="/orders" style={{ marginRight: 12 }}>All</Link>
        <Link to="/orders/placed" style={{ marginRight: 12 }}>Placed</Link>
        <Link to="/orders/cancelled" style={{ marginRight: 12 }}>Cancelled</Link>
      </div>
      {orders.length === 0 ? <p>No orders yet</p> : (
        <div>
          {orders.map(o => (
            <div key={o._id} className="card" style={{ marginBottom: 10 }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <strong>Order {o._id}</strong>
                  <div className="footer-note">Status: {o.status} {o.status==='cancelled' && ` — cancelled at ${o.cancelledAt ? new Date(o.cancelledAt).toLocaleString() : ''}`}</div>
                </div>
                <div>
                  <div>Total: <strong>${(o.total || 0).toFixed(2)}</strong></div>
                  {o.status==='placed' && <button className="btn-ghost" onClick={() => handleCancel(o._id)}>Cancel</button>}
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                {o.items.map(i => (
                  <div key={i.product} className="cart-item">
                    <div>{i.name}</div>
                    <div>Qty: {i.quantity}</div>
                    <div>${(i.price * i.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
