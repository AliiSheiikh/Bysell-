import { useEffect, useState } from 'react'
import { getItems } from '../api'
import type { Item } from '../types'

export default function ProductsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getItems()
      .then((data) => setItems(data))
      .catch((err: Error) => setError(err.message))
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
