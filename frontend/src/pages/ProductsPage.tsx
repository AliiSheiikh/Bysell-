import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getItems, type SortBy } from '../api'
import { CATEGORIES, formatLabel, type Category, type Item } from '../types'

export default function ProductsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [keyword, setKeyword] = useState<string>('')
  const [category, setCategory] = useState<Category | ''>('')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortBy>('newest')

  const [page, setPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)

  function loadItems(pageToLoad: number, sortOverride?: SortBy) {
    setLoading(true)
    setError(null)

    getItems({
      keyword: keyword || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sortOverride ?? sortBy,
      page: pageToLoad,
    })
      .then((data) => {
        setItems(data.content)
        setPage(data.page)
        setTotalPages(data.totalPages)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems(0)
  }, [])

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    loadItems(0)
  }

  return (
    <div>
      <h1>Available Items</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input placeholder="Search by name..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />

        <select value={category} onChange={(e) => setCategory(e.target.value as Category | '')}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{formatLabel(c)}</option>
          ))}
        </select>

        <input type="number" placeholder="Min price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

        <select value={sortBy} onChange={(e) => {
          const newSort = e.target.value as SortBy
          setSortBy(newSort)
          loadItems(0, newSort)
        }}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>

        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading items...</p>}
      {error && <p>Error: {error}</p>}

      <div className="item-grid">
        {items.map((item) => (
          <Link to={`/items/${item.id}`} className="item-card" key={item.id}>
            {item.mainImageUrl && <img className="item-thumbnail" src={item.mainImageUrl} alt={item.title} />}
            <h2>{item.title}</h2>
            <p className="item-description">{item.description}</p>
            <p className="price">${item.price}</p>
            {item.category && <p className="category">{formatLabel(item.category)}</p>}
          </Link>
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
