// API helper with improved error handling and Vite env support
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res = await fetch(API_BASE + path, { method, headers, body: body ? JSON.stringify(body) : null })
    const text = await res.text()
    let data
    try { data = text ? JSON.parse(text) : {} } catch (e) { data = text }

    if (!res.ok) {
      const errMsg = data && data.msg ? data.msg : (typeof data === 'string' ? data : JSON.stringify(data))
      throw new Error(errMsg)
    }

    return data
  } catch (err) {
    // Network error (server unreachable) throws a TypeError in fetch
    if (err instanceof TypeError) throw new Error('Network error: unable to reach server')
    throw err
  }
}

export const signup = (data) => request('/auth/signup', 'POST', data)
export const login = (data) => request('/auth/login', 'POST', data)
export const getProducts = () => request('/products')
export const getProduct = (id) => request(`/products/${id}`)
export const addProduct = (data, token) => request('/products', 'POST', data, token)
export const addToCart = (productId, qty = 1, token) => request('/cart', 'POST', { productId, quantity: qty }, token)
export const getCart = (token) => request('/cart', 'GET', null, token)
export const updateCart = (productId, quantity, token) => request('/cart', 'PUT', { productId, quantity }, token)
export const removeFromCart = (productId, token) => request(`/cart/${productId}`, 'DELETE', null, token)
export const checkout = (token) => request('/orders/checkout', 'POST', null, token)
export const getOrders = (token, status) => request(`/orders${status ? `?status=${status}` : ''}`, 'GET', null, token)
export const cancelOrder = (orderId, token) => request(`/orders/${orderId}/cancel`, 'PUT', null, token)
