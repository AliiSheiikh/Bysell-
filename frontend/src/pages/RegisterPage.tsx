import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    try {
      await register({ firstName, lastName, email, password })
      navigate('/login')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="create-item-form">
        <label>
          First name
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </label>

        <label>
          Last name
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </label>

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            minLength={8} required />
        </label>

        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
