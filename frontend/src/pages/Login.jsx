import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'

export default function Login({ setToken }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      const res = await login({ email, password })
      setToken(res.token)
      navigate('/')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 12a4 4 0 100-8 4 4 0 000 8z"></path><path d="M3 21a9 9 0 0118 0"></path></svg>
        <h2>Welcome back</h2>
      </div>
      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error">{error}</div>}
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="username" required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  )
}
