import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteItem, getMyItems } from '../api'
import { isLoggedIn } from '../auth'
import { formatLabel, type Item } from '../types'

export default function MyListingsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login')
      return
    }
    loadItems(0)
  }, [navigate])

  function loadItems(pageToLoad: number) {
    setLoading(true)
    setError(null)

    getMyItems(pageToLoad)
      .then((data) => {
        setItems(data.content)
        setPage(data.page)
        setTotalPages(data.totalPages)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Remove this listing? This cannot be undone.')) return

    try {
      await deleteItem(id)
      const isLastItemOnPage = items.length === 1 && page > 0
      loadItems(isLastItemOnPage ? page - 1 : page)
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
            {item.category && <p className="category">{formatLabel(item.category)}</p>}
            <div className="item-actions">
              <Link to={`/items/${item.id}/edit`} className="link-button">Edit</Link>
              <button className="remove-button" onClick={() => handleDelete(item.id)}>Remove Listing</button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button type="button" disabled={page === 0} onClick={() => loadItems(page - 1)}>Previous</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button type="button" disabled={page >= totalPages - 1} onClick={() => loadItems(page + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}
