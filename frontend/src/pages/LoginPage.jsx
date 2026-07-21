import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'
import { saveToken } from '../auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    try {
      const response = await login({ email, password })
      saveToken(response.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="create-item-form">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        <button type="submit">Log In</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
