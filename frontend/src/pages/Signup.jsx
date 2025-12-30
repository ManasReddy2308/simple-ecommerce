import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../api'

export default function Signup({ setToken }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const res = await signup({ name, email, password })
      setToken(res.token)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Signup failed')
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h18v6H3z"></path><path d="M5 13h14v8H5z"></path></svg>
        <h2>Create account</h2>
      </div>
      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error">{error}</div>}
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} autoComplete="name" required />
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required />
        <button type="submit" className="btn-primary">Signup</button>
      </form>
    </div>
  )
}
