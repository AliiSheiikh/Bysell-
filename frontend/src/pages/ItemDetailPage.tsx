import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getItem } from '../api'
import { getUserId } from '../auth'
import type { ItemDetail } from '../types'

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<ItemDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    setLoading(true)
    setError(null)

    getItem(Number(id))
      .then((data) => setItem(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading item...</p>
  if (error) return <p className="error">Error: {error}</p>
  if (!item) return null

  return (
    <div className="item-detail">
      <h1>{item.title}</h1>
      {item.ownerId === getUserId() && <Link to={`/items/${item.id}/edit`}>Edit Listing</Link>}

      <div className="item-detail-images">
        {item.images.map((image) => (
          <img key={image.id} src={image.imageUrl} alt={item.title} className="item-detail-image" />
        ))}
      </div>

      <p className="price">${item.price}</p>
      {item.category && <p className="category">{item.category}</p>}
      <p>Status: {item.status}</p>
      <p>{item.description}</p>

      <div className="seller-info">
        <h2>Seller</h2>
        <p>{item.sellerName}</p>
        <p>{item.sellerEmail}</p>
      </div>
    </div>
  )
}
