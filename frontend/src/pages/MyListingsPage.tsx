import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteItem, getMyItems } from '../api'
import { isLoggedIn } from '../auth'
import type { Item } from '../types'

export default function MyListingsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login')
      return
    }
    loadItems()
  }, [navigate])

  function loadItems() {
    setLoading(true)
    setError(null)

    getMyItems()
      .then((data) => setItems(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Remove this listing? This cannot be undone.')) return

    try {
      await deleteItem(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div>
      <h1>My Listings</h1>

      {loading && <p>Loading your listings...</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && items.length === 0 && <p>You haven't listed any items yet.</p>}

      <div className="item-grid">
        {items.map((item) => (
          <div className="item-card" key={item.id}>
            {item.mainImageUrl && <img className="item-thumbnail" src={item.mainImageUrl} alt={item.title} />}
            <h2>{item.title}</h2>
            <p className="price">${item.price}</p>
            {item.category && <p className="category">{item.category}</p>}
            <p className="status">{item.status}</p>
            <div className="item-actions">
              <Link to={`/items/${item.id}/edit`}>Edit</Link>
              <button className="remove-button" onClick={() => handleDelete(item.id)}>Remove Listing</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
