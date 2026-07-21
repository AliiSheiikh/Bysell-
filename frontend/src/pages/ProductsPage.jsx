import { useEffect, useState } from 'react'
import { getItems } from '../api'

export default function ProductsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getItems()
      .then((data) => setItems(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading items...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h1>Bysell — Available Items</h1>
      <div className="item-grid">
        {items.map((item) => (
          <div className="item-card" key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <p className="price">${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
