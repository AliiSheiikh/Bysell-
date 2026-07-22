import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addItemImage, getItem, removeItemImage, updateItem } from '../api'
import { getUserId, isLoggedIn } from '../auth'
import { CATEGORIES, formatLabel, type Category, type ItemImage } from '../types'

const MAX_IMAGES = 8

export default function EditItemPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [category, setCategory] = useState<Category>(CATEGORIES[0])
  const [images, setImages] = useState<ItemImage[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [forbidden, setForbidden] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login')
      return
    }
    if (!id) return

    getItem(Number(id))
      .then((item) => {
        if (item.ownerId !== getUserId()) {
          setForbidden(true)
          return
        }
        setTitle(item.title)
        setDescription(item.description ?? '')
        setPrice(String(item.price))
        setCategory((item.category ?? CATEGORIES[0]) as Category)
        setImages(item.images)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, navigate])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!id) return
    setError(null)

    try {
      await updateItem(Number(id), {
        title,
        description: description || null,
        price: Number(price),
        category,
      })
      navigate(`/items/${id}`)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function handleAddImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !id) return

    setImageError(null)

    if (images.length >= MAX_IMAGES) {
      setImageError(`You can have at most ${MAX_IMAGES} images.`)
      return
    }

    try {
      const image = await addItemImage(Number(id), file)
      setImages((prev) => [...prev, image])
    } catch (err) {
      setImageError((err as Error).message)
    }
  }

  async function handleRemoveImage(imageId: number) {
    if (!id) return
    setImageError(null)

    if (images.length <= 1) {
      setImageError('An item must have at least one image.')
      return
    }
    if (!window.confirm('Remove this image?')) return

    try {
      await removeItemImage(Number(id), imageId)
      setImages((prev) => prev.filter((image) => image.id !== imageId))
    } catch (err) {
      setImageError((err as Error).message)
    }
  }

  if (loading) return <p>Loading item...</p>
  if (forbidden) return <div className="notice"><p className="error">You don't have permission to edit this item.</p></div>

  return (
    <div>
      <h1>Edit Item</h1>

      <div className="item-detail-images">
        {images.map((image) => (
          <div key={image.id} className="editable-image">
            <img src={image.imageUrl} alt={title} className="item-detail-image" />
            <button type="button" className="remove-button" onClick={() => handleRemoveImage(image.id)}>Remove</button>
          </div>
        ))}
      </div>

      {images.length < MAX_IMAGES && (
        <label>
          Add image
          <input type="file" accept="image/*" onChange={handleAddImage} />
        </label>
      )}
      {imageError && <p className="error">{imageError}</p>}

      <div className="form-card">
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

          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{formatLabel(c)}</option>
              ))}
            </select>
          </label>

          <button type="submit">Save Changes</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  )
}
