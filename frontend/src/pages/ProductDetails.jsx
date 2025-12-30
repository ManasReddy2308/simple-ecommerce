import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProduct, addToCart } from '../api'

export default function ProductDetails({ token }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => { fetchProduct() }, [id])

  async function fetchProduct() {
    try {
      const res = await getProduct(id)
      setProduct(res)
    } catch (err) { console.error(err) }
  }

  async function handleAdd() {
    if (!token) return alert('Login to add to cart')
    try {
      const cart = await addToCart(product._id, 1, token)
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }))
      alert('Added to cart')
    } catch (err) {
      console.error(err)
      alert(err.message || 'Error adding to cart')
    }
  }

  if (!product) return <div>Loading...</div>
  return (
    <div>
      <img src={product.image || '/placeholder.png'} alt={product.name} style={{ width: '100%', maxWidth: 600, borderRadius: 8, marginBottom: 12 }} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p><strong>${product.price.toFixed(2)}</strong></p>
      <button className="btn-primary" onClick={handleAdd}>Add to cart</button>
    </div>
  )
}
