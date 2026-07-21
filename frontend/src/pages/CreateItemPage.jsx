import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createItem } from '../api'

export default function CreateItemPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    try {
      await createItem({
        title,
        description: description || null,
        price: Number(price),
      })
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h1>Create Item</h1>
      <form onSubmit={handleSubmit} className="create-item-form">
        <label>
          Name
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>

        <label>
          Description
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <label>
          Price
          <input type="number" step="0.01" min="0" value={price}
            onChange={(e) => setPrice(e.target.value)} required />
        </label>

        <button type="submit">Create Item</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
