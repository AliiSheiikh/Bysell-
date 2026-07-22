import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import ProductsPage from './pages/ProductsPage'
import CreateItemPage from './pages/CreateItemPage'
import ItemDetailPage from './pages/ItemDetailPage'
import EditItemPage from './pages/EditItemPage'
import MyListingsPage from './pages/MyListingsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { isLoggedIn, clearToken } from './auth'
import './App.css'

function NavBar() {
  useLocation() // re-render whenever the route changes, so isLoggedIn() below reads fresh
  const navigate = useNavigate()

  function handleLogout() {
    clearToken()
    navigate('/')
  }

  return (
    <nav className="nav">
      <Link to="/">All Products</Link>
      {isLoggedIn() ? (
        <>
          <Link to="/create">Create Item</Link>
          <Link to="/my-listings">My Listings</Link>
          <button onClick={handleLogout}>Log Out</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />

        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/create" element={<CreateItemPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/items/:id/edit" element={<EditItemPage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
