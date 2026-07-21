import { useEffect, useState, type FormEvent } from 'react'
import { getItems } from '../api'
import { CATEGORIES, type Category, type Item } from '../types'

export default function ProductsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [keyword, setKeyword] = useState<string>('')
  const [category, setCategory] = useState<Category | ''>('')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')

  function loadItems() {
    setLoading(true)
    setError(null)

    getItems({
      keyword: keyword || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    })
      .then((data) => setItems(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
  }, [])

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    loadItems()
  }

  return (
    <div>
      <h1>Bysell — Available Items</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input placeholder="Search by name..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />

        <select value={category} onChange={(e) => setCategory(e.target.value as Category | '')}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input type="number" placeholder="Min price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading items...</p>}
      {error && <p>Error: {error}</p>}

      <div className="item-grid">
        {items.map((item) => (
          <div className="item-card" key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <p className="price">${item.price}</p>
            {item.category && <p className="category">{item.category}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
